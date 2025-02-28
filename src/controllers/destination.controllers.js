import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Destination } from "../models/destination.model.js";
import { DestinationBooking } from "../models/destination.booking.model.js";

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
    const { inclusion_exclusion, __v, ...destinationData } = destination.toObject();



    return res.status(200).json({
      status: 200,
      data: destinationData,
      massage: `${req.params.id} data`,
    });
  } catch (error) {
    console.log(error);
  }
});

const destinationBooking = asyncHandler(async (req, res) => {
 try {
   const { fullName, email, destinationId, contactNumber, people,selectTourDate } = req.body;
   if (
     [fullName, email, destinationId, contactNumber, people,selectTourDate].some(field => field === '')
   ) {
     throw new ApiError(404, 'destination booking some field is missing')
   };
 
   const existDesBooking = await DestinationBooking.findOne({
    email: email,
    destinationId: destinationId
   });

   if (existDesBooking) {
    return res.json({errorMessage: 'Already booking this destination'})
   }
 
   const createDesBooking = await new DestinationBooking({
     fullName,
     email,
     destinationId,
     contactNumber,
     people,
     selectTourDate
   });
 
   await createDesBooking.save(); 
   
console.log(createDesBooking);

   return res
   .status(200)
   .json({message: "Booking confirm successfully"})
   
 } catch (error) {
   console.log(error);
   
 }
})

export { getAllDestinations, getDestinationById, destinationBooking };
