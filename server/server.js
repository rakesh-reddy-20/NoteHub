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
const allowedOrigins = [
  "http://localhost:5173",
  "https://notehub.vercel.app", // your frontend production URL
];

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const hostname = new URL(origin).hostname;

      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(hostname) // allow all vercel subdomains
      ) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
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
