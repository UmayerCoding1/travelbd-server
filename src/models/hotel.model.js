import mongoose, { Schema } from "mongoose";
const hotelSchema = new Schema({
    hotelName: {
        type: String,
        required: true,
        index: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
    },
    star: {
        type: Number,
        require: true
    },
    nearby: {
        type: Array,
    },
    couple: {
        type: Boolean,
    },
    amenities: { type: Array },
    hotelImage: { type: Array, require: true },
    rooms: [
        {
            title: {
                type: String,
                require: true
            },
            people: {
                adults: { type: Number },
                children: { type: Number }
            },
            catering: {
                morning: { type: Boolean },
                lunch: { type: Boolean },
                dinner: { type: Boolean }
            },
            bad: { type: String },
            RoomCapacity: { type: Number },
            available: { type: Number },
            roomType: { type: String },
            roomCharacteristics: { type: String },
            roomView: { type: String },
            facilities: [
                {
                    category: { type: String },
                    item: { type: Array }
                }
            ],
            roomImage: { type: Array },
        }
    ],
    onlinePayment: {
        type:Boolean,
        default: false,
    },
    priceing: {
        price: { type: Number },
        discount: { type: Number },
        texes: { type: Number },
        duration: { type: String }
    }


}, { timestamps: true });

export const Hotel = mongoose.model('Hotel', hotelSchema);