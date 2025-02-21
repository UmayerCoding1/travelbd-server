import  express  from "express";
import { getAllHotels, getHotelById } from "../controllers/hotel.controllers.js";


const hotelRouter = express.Router();

hotelRouter.get('/hotels', getAllHotels);
hotelRouter.get('/hotel/:id', getHotelById);


export default hotelRouter;