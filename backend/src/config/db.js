import mongoose from "mongoose";

export const dbConnected = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGODBURI;
  if (!uri) {
    if (process.env.NODE_ENV === "test") {
      return null;
    }
    console.error("Database connection error: MONGODB_URI or MONGODBURI is not defined.");
    process.exit(1);
  }

  try {
    const maxPoolSize = Number(process.env.MONGODB_MAX_POOL_SIZE) || 50;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      maxPoolSize,
    });

    console.log(`MongoDB Connected: ${conn.connection.host} (pool size: ${maxPoolSize})`);
    return conn;
  } catch (error) {

    console.error(`Database connection error: ${error.message}`);
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
    throw error;
  }
};

export const dbDisconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};


