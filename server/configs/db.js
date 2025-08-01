import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ MongoDB connected successfully.");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // optional: exit process on failure
  }
};

export default connectDB;
