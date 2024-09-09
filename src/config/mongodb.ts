import mongoose from "mongoose";

const connectToMongoDB = async (): Promise<void> => {
  try {
    const mongoURI: string = process.env.MONGODB_URI ?? "";
    if (mongoURI === "") {
      console.error("Error connecting to MongoDB: URI is empty");
      process.exit(1);
    }
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
export default connectToMongoDB;
