import mongoose, { Schema } from "mongoose";

const hotelBookingSchema = new Schema({
  cusName: {
    type: String,
    require: true
  },
  cusEmail: {
    type: String,
    require: true
  },
  cunNumber: {
    type: String,
    require: true
  },
  amount: {
    type: Number,
    require: true
  },
  hotelId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hotel',
    require: true
  },
  roomName: {
    type: String,
    require: true
  },
  PartiallyPaid: {
    type: Number
  },
  restAmount: {
    type: Number
  },
  bookingDetails: {
    checkIn: {
      type: String,
      require: true
    },
    checkOut: {
      type: String,
      require: true
    },
    numberOfRoom: {
      type: Number,
      require: true
    },
    adults: {
      type: Number,
      require: true
    },
    children: {
      type: Number,
      require: true
    }
  },
  guestDetails: {
    adults: [
      {
        name: {type: String},
        contact:{type: String}
      }
    ],

    children:[
      {
        name:{type:String},
        age:{type:String}
      }
    ]

  },
  paymentStatus: {
    type: String,
    default: 'Pending'
  },
  tranjectionId: {
    type: String
  },

}, { timestamps: true });

export const hotelBooking = mongoose.model('HotelBooking', hotelBookingSchema)