import mongoose,{Schema} from "mongoose";

const destinationBookingSchema = new Schema({
  fullName:{
    type: String,
    require: true
  },
  email:{
    type: String,
    require: true
  },
  destinationId:{
    type: mongoose.Schema.ObjectId,
    ref:'DESTINATION',
    require: true
  },
  contactNumber:{
    type: String,
    require: true
  },
  selectTourDate: {
   type: String,
   require: true
  },
  people:{
    type: Number,
    require: true
  },
  status:{
    type: String,
    default: 'Pending',
  }
},{timestamps: true});

export const DestinationBooking = mongoose.model('destinationBooking', destinationBookingSchema);