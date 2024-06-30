import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URL);
      console.log("Connected to MongoDB");
    }
  } catch (error) {
    console.log("Failed to connect", error.message);
  }
};
