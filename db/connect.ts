'use server';

import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL!;

if (!MONGO_URL) {
  throw new Error("❌ MONGO_URL is not defined in environment variables");
}

let isConnected = false;
export async function connectDB() {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(MONGO_URL);

    isConnected = true;
    return conn;
  } catch (error) {
    console.error("[DBError] MongoDB connection error:", error);
    throw error;
  }
}

