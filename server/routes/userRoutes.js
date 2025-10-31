import express from "express";

// Controllers
import { getUserProfile } from "../controllers/userController.js";

// Middlewares
import userAuth from "./../middleware/userAuth.js";

// Router
const userRouter = express.Router();

userRouter.get("/profile", userAuth, getUserProfile);

export default userRouter;
