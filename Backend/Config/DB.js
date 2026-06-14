
import mongoose from "mongoose";
import initConfig from "../utils/initConfig.js";

const connectDB = async () => {
  try {

    await mongoose.connect(process.env.MONGODB_URL);

    console.log("✅ MongoDB connected successfully");


    await initConfig();

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;