import mongoose from "mongoose";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Hotel } from "../models/hotel.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const getAllHotels = asyncHandler(async (req, res) => {
  try {
    const hotels = await Hotel.find();

    if (!hotels) {
      throw new ApiError(404, 'Hotels not found')
    }


    res
      .status(200)
      .json(new ApiResponse(200, hotels, 'All hotels'))
  } catch (error) {
    console.log(error.message);
  }
});


const getHotelById = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    
    const hotel = await Hotel.findById(id);
    res
      .status(200)
      .json(new ApiResponse(200, hotel, ''))
  } catch (error) {
    console.log(error.message);
  }



})

export {
  getAllHotels,
  getHotelById
}