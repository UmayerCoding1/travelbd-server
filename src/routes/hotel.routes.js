import express from 'express';

import { getAllHotelBookings, getAllHotels, getHotelById, hotelBookingPayment, hotelPaymentFild, hotelPaymentSuccess } from '../controllers/hotel.controllers.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';


const hotelRoutes = express.Router();
hotelRoutes.get('/hotels', getAllHotels);
hotelRoutes.get('/hotel/:id', getHotelById);
hotelRoutes.get('/hotel-bookings',verifyToken, getAllHotelBookings);
hotelRoutes.post('/payment/success/:tranId', hotelPaymentSuccess);
hotelRoutes.post('/payment/fail/:tranId', hotelPaymentFild);
hotelRoutes.post('/booking-payment',verifyToken, hotelBookingPayment);


export default hotelRoutes;