import { Location } from "../models/location.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const getAllLocations = asyncHandler(async (req, res) => {
  try {
    const locations = await Location.find();
    return res.status(200).json({
      status: 200,
      data: locations,
      message: "All locations",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Server error",
      error: error.message,
    });
  }
});

export { getAllLocations };