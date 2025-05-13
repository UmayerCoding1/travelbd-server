import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { hotelBooking } from "../models/hotelBooking.model.js";
import SSLCommerzPayment from "sslcommerz-lts";
import { Hotel } from "../models/hotel.model.js";
const store_id = "umaye67bf3b0e448d4";
const store_pass = "umaye67bf3b0e448d4@ssl";
const is_live = false;

const getAllHotels = asyncHandler(async (req, res) => {
  try {
    const { location } = req.query;

    const query =
      location && location.trim() !== ""
        ? { PrimaryLocation: { $regex: location, $options: "i" } }
        : {};

    const hotels = await Hotel.find(query);

    if (!hotels) {
      throw new ApiError(404, "Hotels not found");
    }

    res.status(200).json(new ApiResponse(200, hotels, "All hotels"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Internal server error"));
  }
});

const getHotelById = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;

    const hotel = await Hotel.findById(id);
    res.status(200).json(new ApiResponse(200, hotel, ""));
  } catch (error) {
    console.log(error.message);
  }
});

const getAllHotelBookings = asyncHandler(async (req, res) => {
  const { email, status } = req.query;

  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const query = {
    ...(user && {
      cusEmail: user?.email,
    }),

    ...(status && {
      paymentStatus: status,
    }),
  };
  const bookings = await hotelBooking.find(query).populate("hotelId");

  if (!bookings) {
    throw new ApiError(404, "No booking found this email");
  }

  res.status(200).json(new ApiResponse(200, bookings, "all booking"));
});

const hotelBookingPayment = asyncHandler(async (req, res) => {
  try {
    const {
      cusName,
      cusEmail,
      cusNumber,
      amount,
      bookingDetails,
      hotelId,
      roomName,
      guestDetails,
    } = req.body;
    if (
      [
        cusName,
        cusEmail,
        cusNumber,
        amount,
        bookingDetails,
        hotelId,
        roomName,
        guestDetails,
      ].some((field) => field === "" || field === undefined || field === null)
    ) {
      throw new ApiError(404, "Some field not found");
    }

    const user = await User.findOne({ email: cusEmail });
    if (!user) {
      throw new ApiError(404, "User not Found");
    }
    const tran_id = `${new Date().getTime()}`;
    const payment_price = Math.round((amount * 10) / 100) + 3;

    // Use bookingDetails for customer and shipping info, fallback to empty string if not provided
    const data = {
      total_amount: payment_price,
      currency: "BDT",
      tran_id: tran_id, // use unique tran_id for each api call
      success_url: `http://localhost:8000/api/v1/payment/success/${tran_id}`,
      fail_url: `http://localhost:8000/api/v1/payment/fail/${tran_id}`,
      cancel_url: `http://localhost:8000/api/v1/payment/cancel/${tran_id}`,
      ipn_url: `http://localhost:8000/api/v1/payment/ipn/${tran_id}`,
      shipping_method: "Courier",
      product_name: "Hotel Booking",
      product_category: "Hospitality",
      product_profile: "general",
      cus_name: cusName,
      cus_email: cusEmail,
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_postcode: "1205",
      cus_country: "Bangladesh",
      cus_phone: cusNumber,
      cus_fax: "2333444",
      ship_name: cusName,
      ship_name: cusName,
      ship_add1: "Dhaka",
      ship_city: "Dhaka",
      ship_postcode: "1205",
      ship_country: "Bangladesh",
    };

    const sslczl = new SSLCommerzPayment(store_id, store_pass, is_live);
    sslczl.init(data).then(async (apiResponse) => {
      let GatewayPageURL = apiResponse.GatewayPageURL;
      res.send({ url: GatewayPageURL });

      const finalBooking = new hotelBooking({
        tranjectionId: tran_id,
        cusName,
        cusEmail,
        cunNumber: cusNumber ? cusNumber : "",
        amount,
        PartiallyPaid: payment_price,
        restAmount: amount - payment_price,
        hotelId,
        roomName,
        bookingDetails,
        guestDetails,
        paymentStatus: "pending",
        ok: "qe",
      });
      await finalBooking.save();
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Payment initialization failed", error: error.message });
  }
});

const hotelPaymentSuccess = asyncHandler(async (req, res) => {
  try {
    const { tranId } = req.params;
    const bookedHotel = await hotelBooking.findOneAndUpdate(
      { tranjectionId: tranId },
      {
        $set: {
          paymentStatus: "Partially Paid",
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!bookedHotel) {
      throw new ApiError(404, "Booking not found");
    }

    if (bookedHotel) {
      res.redirect("http://localhost:5173/my-booking");
    }
  } catch (error) {
    console.log(error);
  }
});

const hotelPaymentFild = asyncHandler(async (req, res) => {
  try {
    const { tranId } = req.params;
    const fildBooking = await hotelBooking.findOneAndDelete({
      tranjectionId: tranId,
    });
    if (fildBooking) {
      res.redirect("http://localhost:5173/profile");
    } else {
      throw new ApiError(404, "Booking not found");
    }
  } catch (error) {
    console.log(error);
  }
});

const getUserHotelBooking = asyncHandler(async (req, res) => {
  const { email } = req.query;
  console.log(email);
  
    try {
      const bookedHotels = await hotelBooking.find({ cusEmail: email });
      if (!bookedHotels) {
        throw new ApiError(404, "No booking found for this email");
      }
      console.log(bookedHotels.length);
      
      res.status(200).json(new ApiResponse(200, bookedHotels, "All bookings"));
    } catch (error) {
      console.log(error);
      res.status(500).json(new ApiError(500, "Internal server error"));
    }
});

export {
  getAllHotels,
  getHotelById,
  getAllHotelBookings,
  hotelBookingPayment,
  hotelPaymentSuccess,
  hotelPaymentFild,
  getUserHotelBooking
};
