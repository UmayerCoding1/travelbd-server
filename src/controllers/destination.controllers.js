import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Destination } from "../models/destination.model.js";

//**
// TODO 1: implement view count route (des: user click any tour and hotel then view + 1 default value is 0);
//  */

const getAllDestinations = asyncHandler(async (req, res) => {
  const destinations = await Destination.find();
  if (!destinations) {
    throw new ApiError(404, "destinations not found");
  }

  return res.send({
    status: 200,
    data: destinations,
    massage: "All destination hear",
  });
});

const getDestinationById = asyncHandler(async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    const { inclusion_exclusion,__v, ...destinationData } = destination.toObject();
    
    
   
    return res.status(200).json({
      status: 200,
      data: destinationData,
      massage: `${req.params.id} data`,
    });
  } catch (error) {
    console.log(error);
  }
});

export { getAllDestinations , getDestinationById };
