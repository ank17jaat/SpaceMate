import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  officeId: String,
  userName: String,
  userEmail: String,
  date: String,
  timeSlot: String,
  createdAt: { type: Date, default: Date.now }
});

export const Booking = mongoose.model("Booking", bookingSchema);
