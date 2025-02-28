import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
const sslcommerzStoreId = "YOUR_SSLCOMMERZ_STORE_ID";
const sslcommerzSecretKey = "YOUR_SSLCOMMERZ_SECRET_KEY";
const sslcommerzApiUrl = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Model for Payments
const paymentSchema = new mongoose.Schema({
  bookingId: String,
  userId: String,
  totalAmount: Number,
  paidAmount: Number,
  status: { type: String, enum: ["Pending", "Partially Paid", "Fully Paid"] },
  paymentMethod: { type: String, enum: ["SSLCOMMERZ"] },
});

const Payment = mongoose.model("Payment", paymentSchema);

// Route to initiate SSLCOMMERZ payment (10% upfront)
app.post("/pay/sslcommerz", async (req, res) => {
  const { bookingId, userId, totalAmount } = req.body;
  const amountToPay = totalAmount * 0.1;

  const transactionData = {
    store_id: sslcommerzStoreId,
    store_passwd: sslcommerzSecretKey,
    total_amount: amountToPay,
    currency: "BDT",
    tran_id: bookingId,
    success_url: "YOUR_SUCCESS_URL",
    fail_url: "YOUR_FAIL_URL",
    cancel_url: "YOUR_CANCEL_URL",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
  };

  try {
    const response = await fetch(sslcommerzApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transactionData),
    });
    const result = await response.json();
    res.json({ paymentUrl: result.GatewayPageURL });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to process final payment (90% remaining)
app.post("/pay/final/sslcommerz", async (req, res) => {
  const { bookingId, amount } = req.body;
  
  try {
    const payment = await Payment.findOne({ bookingId });
    if (!payment || payment.status === "Fully Paid") {
      return res.status(400).json({ error: "Invalid or already paid booking" });
    }
    
    payment.paidAmount += amount;
    payment.status = "Fully Paid";
    await payment.save();
    
    res.json({ message: "Final payment successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`SSLCOMMERZ server running on port ${PORT}`));
