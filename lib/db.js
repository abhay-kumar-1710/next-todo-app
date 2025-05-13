import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("MONGO DB CONNECTED!");
  } catch (error) {
    console.log("FAILED TO CONNECT MONGO DB!", error);
  }
};
