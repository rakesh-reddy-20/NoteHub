import mongoose from "mongoose";

const connectDB = async () => {
  const dbName = "NoteHub";
  const uri = process.env.MONGODB_URI.replace(/\/$/, "") + "/" + dbName;

  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  };

  try {
    await mongoose.connect(uri, options);
    console.log("MongoDB connected:", mongoose.connection.host);
  } catch (error) {
    console.error("Initial connection error:", error.message);
    process.exit(1);
  }

  mongoose.connection.on("connected", () => console.log("Database Connected"));
  mongoose.connection.on("error", (err) =>
    console.error("Connection error:", err)
  );
  mongoose.connection.on("disconnected", () =>
    console.warn("Database Disconnected")
  );

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
  });
};

export default connectDB;
