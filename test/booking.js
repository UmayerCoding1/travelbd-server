import mongoose from "mongoose";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { hotelBooking } from "../models/hotelBooking.model.js";
import SSLCommerzPayment from "sslcommerz-lts";
import dotenv from "dotenv";

dotenv.config();

const store_id = process.env.STORE_ID;
const store_pass = process.env.STORE_PASSWORD;
const is_live = false;

const getAllBookings = asyncHandler(async (req, res) => {
  const userEmail = req.query.email;
  const user = await User.findOne({ email: userEmail });
  if (!user) throw new ApiError(404, "User not found");

  const bookings = await hotelBooking.find({ cusEmail: userEmail }).populate("hotelId");
  if (!bookings.length) throw new ApiError(404, "No booking found with this email");

  res.status(200).json(new ApiResponse(200, bookings, "All bookings retrieved"));
});

const hotelBookingPayment = asyncHandler(async (req, res) => {
  const { cusName, cusEmail, cusNumber, amount, bookingDetails, hotelId, roomId } = req.body;
  const payment_price = Math.round((amount * 10) / 100) + 3;
  const tran_id = Date.now().toString();

  const data = {
    total_amount: payment_price,
    currency: 'BDT',
    tran_id: tran_id,
    success_url: `${process.env.SERVER_SITE_URL}/payment/success/${tran_id}`,
    fail_url: `${process.env.SERVER_SITE_URL}/fail/${tran_id}`,
    cancel_url: 'http://localhost:3030/cancel',
    ipn_url: 'http://localhost:3030/ipn',
    shipping_method: 'Courier',
    product_name: 'Computer.',
    product_category: 'Electronic',
    product_profile: 'general',
    cus_name: cusName,
    cus_email: cusEmail,
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: cusNumber,
    cus_fax: '01711111111',
    ship_name: 'Customer Name',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
};

  const sslcz = new SSLCommerzPayment(store_id, store_pass, is_live);
  sslcz.init(data).then(async (apiResponse) => {
    console.log("SSLCommerz Response:", apiResponse);
    const GatewayPageURL = apiResponse.GatewayPageURL;
    if (!GatewayPageURL) throw new ApiError(500, "Payment gateway error");
    
    res.send({ url: GatewayPageURL });
    
    const finalBooking = new hotelBooking({
      tranjectionId: tran_id,
      cusName,
      cusEmail,
      cusNumber,
      amount,
      PartiallyPaid: payment_price,
      restAmount: amount - payment_price,
      hotelId,
      roomId,
      bookingDetails,
      paymentStatus: "pending",
    });
    await finalBooking.save();
    console.log("Booking Saved:", finalBooking);
  }).catch(error => {
    console.error("SSLCommerz Error:", error);
    throw new ApiError(500, "Payment initialization failed");
  });
});

const hotelPaymentSuccess = asyncHandler(async (req, res) => {
  try {
    const tran_id = req.params.tranId;
    console.log("Transaction ID:", tran_id);
    res.send({ message: "Payment successful", tran_id });
  } catch (error) {
    console.error("Payment Success Error:", error);
    throw new ApiError(500, "Payment success handling failed");
  }
});

// export { getAllBookings, hotelBookingPayment, hotelPaymentSuccess };
