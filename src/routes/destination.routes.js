import express from "express";
import { destinationBooking, getAllDestinations, getDestinationById } from "../controllers/destination.controllers.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

router.get('/destinations', getAllDestinations);
router.post('/booking-destination',verifyToken, destinationBooking);
router.get('/destination/:id', getDestinationById);

export default  router;