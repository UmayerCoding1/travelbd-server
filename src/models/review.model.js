import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
   userName:{
    type:String,
    require: true
   },
   userEmail:{
    type:String,
    require:true
   },
   hotelId:{
    type: String,
    require: true
   },
   rating:{
    type: Number,
    require: true,
    min: 1,
    max: 5
   },
   comment:{
    trpe:String,
    require: true
   },
   images:{
    type: [String],
    min:1
   },
},{timestamps: true})