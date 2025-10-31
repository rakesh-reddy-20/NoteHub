import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

// Custom middleware
import errorHandler from "./middleware/errorMiddleware.js";

// Routes
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import docRouter from "./routes/docRoutes.js";

// Database connection
import connectDB from "./config/db.js";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;
const allowedOrigins = [process.env.FRONTEND_URL];

// Middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: allowedOrigins }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

// API route
app.get("/", (req, res) => {
  res.send("hii there!");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/docs", docRouter);

// Start the server
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
