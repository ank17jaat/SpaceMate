import mongoose from "mongoose";

const officeSchema = new mongoose.Schema(
  {
    ownerId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    city: { type: String, required: true, trim: true },
    address: { type: String, default: "", trim: true },
    images: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    type: { type: String, enum: ["office", "hotel"], default: "office" },
    capacity: { type: Number, default: 1, min: 1 },
    rating: { type: Number, default: 0, min: 0 },
    reviewCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

officeSchema.index({ city: 1, price: 1 });
officeSchema.index({ title: "text", description: "text", city: "text" });

export const OfficeSpace = mongoose.model("OfficeSpace", officeSchema);
