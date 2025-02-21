import express from "express";
import { getAllDestinations, getDestinationById } from "../controllers/destination.controllers.js";


const router = express.Router();

router.get('/destinations', getAllDestinations);
router.get('/destination/:id', getDestinationById)

export default  router;