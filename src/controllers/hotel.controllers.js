
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { hotelBooking } from "../models/hotelBooking.model.js";
import SSLCommerzPayment from 'sslcommerz-lts';
import { Hotel } from "../models/hotel.model.js";
const store_id = 'umaye67bf3b0e448d4';
const store_pass = 'umaye67bf3b0e448d4@ssl';
const is_live = false;


const getAllHotels = asyncHandler(async (req, res) => {
  try {
    const {location} = req.query;
    

    const query = location && location.trim() !== '' ? {PrimaryLocation: {$regex: location, $options: 'i'}} : {};
    console.log(query);
    
    
    const hotels = await Hotel.find(query);

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

const getAllHotelBookings = asyncHandler(async (req, res) => {
  const {email,status} = req.query;
  console.log(email,status);
  

  const user = await User.findOne({
    email: email
  });

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

   const query = {
    ...(user && {
      cusEmail: user?.email
    }),
    
    ...(status && {
      paymentStatus: status
    })
   }
  const bookings = await hotelBooking.find(query).populate('hotelId')

  if (!bookings) {
    throw new ApiError(404, 'No booking found this email')
  }


  res
    .status(200)
    .json(new ApiResponse(200, bookings, 'all booking'))

});



const hotelBookingPayment = asyncHandler(async (req, res) => {
  try {
    const { cusName, cusEmail, cusNumber, amount, bookingDetails, hotelId, roomName, guestDetails } = req.body;
    if (
      [cusName, cusEmail, cusNumber, amount, bookingDetails, hotelId, roomName, guestDetails].some((field) => field === "" || field === undefined || field === null)
    ) {
      throw new ApiError(404, 'Some field not found')
    }

    const user = await User.findOne({ email: cusEmail });
    if (!user) {
      throw new ApiError(404, 'User not Found');
    }
    const tran_id = `${new Date().getTime()}`;
    const payment_price = Math.round((amount * 10) / 100) + 3;

    const data = {
      total_amount: payment_price,
      currency: "BDT",
      tran_id: tran_id, // use unique tran_id for each api call
      success_url: `http://localhost:5000/api/v1/payment/success/${tran_id}`,
      fail_url: `http://localhost:5000/api/v1/payment/fail/${tran_id}`,
      cancel_url: "http://localhost:3030/cancel",
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "Courier",
      product_name: "Computer.",
      product_category: "Electronic",
      product_profile: "general",
      cus_name: cusName,
      cus_email: cusEmail,
      cus_add1: 'orderInfo.cus_add',
      cus_add2: 'orderInfo.cus_add',
      cus_city: 'orderInfo.cus_city',
      cus_state: 'orderInfo.cus_state',
      cus_postcode: "***",
      cus_country: "Bangladesh",
      cus_phone: cusNumber,
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };

    const sslczl = new SSLCommerzPayment(store_id, store_pass, is_live);
    sslczl.init(data).then((async (apiResponse) => {
      let GatewayPageURL = apiResponse.GatewayPageURL;
      res.send({url: GatewayPageURL});
      console.log('cusNumber',  roomName);

      const finalBooking = await new hotelBooking({
        tranjectionId: tran_id,
        cusName,
        cusEmail,
        cunNumber: cusNumber ? cusNumber : '',
        amount,
        PartiallyPaid: payment_price,
        restAmount: amount - payment_price,
        hotelId,
        roomName,
        bookingDetails,
        guestDetails,
        paymentStatus: "pending",
        ok: 'qe'
      });
      await finalBooking.save();
    }))
  } catch (error) {
    console.log(error);
  }


});

const hotelPaymentSuccess = asyncHandler(async (req, res) => {
 try {
   const { tranId } = req.params;
   const bookedHotel = await hotelBooking.findOneAndUpdate(
     { tranjectionId: tranId },
     {
       $set: {
         paymentStatus: 'Partially Paid',
         updatedAt: new Date()
       }
     },{new: true}
   );
 
   if (bookedHotel) {
     console.log('Hotel booking successfully',bookedHotel);
     res.redirect('http://localhost:5173/my-booking')
     
   }
 } catch (error) {
   console.log(error);
 }
});

const hotelPaymentFild = asyncHandler(async(req,res) => {
   try {
    const {tranId} = req.params;
    const fildBooking = await hotelBooking.findOneAndDelete({tranjectionId: tranId});
    if (fildBooking) {
      res.redirect('http://localhost:5173/profile')
    }
    else{
      throw new ApiError(404,'Booking not found')
    }
   } catch (error) {
    console.log(error);
   }

})


export {
  getAllHotels,
  getHotelById,
  getAllHotelBookings,
  hotelBookingPayment,
  hotelPaymentSuccess,
  hotelPaymentFild
}