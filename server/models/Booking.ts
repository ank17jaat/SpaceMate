import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    propertyId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
      index: true,
    },
    propertySnapshot: {
      title: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      type: { type: String, enum: ["office", "hotel"], default: "office" },
      images: { type: [String], default: [] },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

bookingSchema.index({ userId: 1, createdAt: -1 });

export const Booking = mongoose.model("Booking", bookingSchema);
