import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Error:", error);
    process.exit(1);
  }
};
