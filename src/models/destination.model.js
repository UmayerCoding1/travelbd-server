import mongoose, { Schema } from "mongoose";

const destinationSchema = new Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    location: {
        type: String, 
        require: true,
    },
    tour_location: {
        type: String,
        require: true,
    },
    offer:{
        day: {
            type: Number
        },
        hours: {
            type: String
        },
        people: {
            type: Number
        }
    },
    requirement: {
        type: Array
    },
    price: {type: Number},
    pick_up:{type: String},
    timing: {type: String},
    image: {
        type: Array,
        required: true
    },
    inclusion_exclusion: {
        inclusion : {type: Array},
        exclusion :  {type: Array}
    },
    description : {type: String},
    option:{type:Array},
    rating: {type: String},
    view_count: {type: Number}
},{timestamps: true})

export const Destination = mongoose.model('DESTINATION', destinationSchema);

