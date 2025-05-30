import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  description: { type: String },
});


const Location = mongoose.model("Location", locationSchema);

export { Location };