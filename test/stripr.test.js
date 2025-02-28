import express from "express";
import Stripe from "stripe";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const stripe = new Stripe("YOUR_STRIPE_SECRET_KEY");

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
  paymentMethod: { type: String, enum: ["Stripe"] },
});

const Payment = mongoose.model("Payment", paymentSchema);

// Route to initiate Stripe payment (10% upfront)
app.post("/pay/stripe", async (req, res) => {
  const { bookingId, userId, totalAmount } = req.body;
  const amountToPay = Math.round(totalAmount * 0.1 * 100); // Convert to cents

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountToPay,
      currency: "usd",
    });

    const newPayment = new Payment({
      bookingId,
      userId,
      totalAmount,
      paidAmount: amountToPay / 100,
      status: "Partially Paid",
      paymentMethod: "Stripe",
    });
    await newPayment.save();

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to process final payment (90% remaining)
app.post("/pay/final/stripe", async (req, res) => {
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Stripe server running on port ${PORT}`));
