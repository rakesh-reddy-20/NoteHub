import express from "express";

// Controllers
import {
  register,
  login,
  logout,
  sendVerificationOTP,
  verifyEmail,
  isAuthenticated,
  sendResetOTP,
  resetPassword,
  deleteAccount,
} from "../controllers/authController.js";

// Middlewares
import userAuth from "./../middleware/userAuth.js";

// Router
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.post("/send-verify-otp", userAuth, sendVerificationOTP);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.get("/is-auth", userAuth, isAuthenticated);

authRouter.post("/send-reset-otp", sendResetOTP);
authRouter.post("/reset-password", resetPassword);

authRouter.delete("/delete-account", userAuth, deleteAccount);

export default authRouter;
