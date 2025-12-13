import mongoose from "mongoose";

const officeSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  city: String,
  address: String,
  image: String,
  amenities: [String],
  capacity: Number,
  createdAt: { type: Date, default: Date.now }
});

export const OfficeSpace = mongoose.model("OfficeSpace", officeSchema);
