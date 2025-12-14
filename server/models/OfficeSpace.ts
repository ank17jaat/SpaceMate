import mongoose from "mongoose";

const officeSchema = new mongoose.Schema({
  ownerId: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  city: { type: String, required: true },
  address: { type: String, default: "" },
  images: { type: [String], default: [] },
  amenities: { type: [String], default: [] },
  capacity: { type: Number, default: 1 },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const OfficeSpace = mongoose.model("OfficeSpace", officeSchema);
