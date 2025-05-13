import express from 'express';

import { getAllHotelBookings, getAllHotels, getHotelById, getUserHotelBooking, hotelBookingPayment, hotelPaymentFild, hotelPaymentSuccess } from '../controllers/hotel.controllers.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';


const hotelRoutes = express.Router();
hotelRoutes.get('/hotels', getAllHotels);
hotelRoutes.get('/hotel/:id', getHotelById);
hotelRoutes.get('/your-hotel-bookings',verifyToken, getUserHotelBooking);
hotelRoutes.get('/hotel-bookings',verifyToken, getAllHotelBookings);
hotelRoutes.post('/booking-payment',verifyToken, hotelBookingPayment);
hotelRoutes.post('/payment/success/:tranId', hotelPaymentSuccess);
hotelRoutes.post('/payment/fail/:tranId', hotelPaymentFild);


export default hotelRoutes;