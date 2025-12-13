import mongoose from "mongoose";

const officeSchema = new mongoose.Schema({
  ownerId: { type: String },
  title: String,
  description: String,
  price: Number,
  city: String,
  address: String,
  image: String,
  images: { type: [String], default: [] },
  amenities: { type: [String], default: [] },
  capacity: Number,
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const OfficeSpace = mongoose.model("OfficeSpace", officeSchema);
