import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

// User Registration
// POST /api/auth/register
// Public
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // required on Render
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Sending welcome email
    const mailOPtions = {
      from: process.env.SENDER_EMAIL,
      to: newUser.email,
      subject: "Welcome to NoteHub!",
      text: `Hello ${newUser.name},\n\nThank you for registering NoteHub.\n\nBest regards!`,
    };

    await transporter.sendMail(mailOPtions);

    return res
      .status(201)
      .json({ success: true, message: "Registration successful." });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Registration failed.",
      error: error.message,
    });
  }
};

// User Login
// POST /api/auth/login
// Public
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password." });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // required on Render
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res
      .status(200)
      .json({ success: true, message: "Login successful." });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Login failed.", error: error.message });
  }
};

// User Logout
// POST /api/auth/logout
// Private
const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logout successful." });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Logout failed.",
      error: error.message,
    });
  }
};

// Send Verification OTP
// POST /api/auth/send-verification-otp
// Private
const sendVerificationOTP = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res
        .status(404)
        .json({ success: false, message: "UserId not found!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Already enable!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyOtp = otp;
    user.verifyOtpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Email Verification OTP",
      text: `Your OTP for email verification is: ${otp}. It is valid for 10 minutes.`,
    };
    await transporter.sendMail(mailOption);

    return res.status(200).json({
      success: true,
      message: "Verification OTP sent to your email.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send verification OTP.",
      error: error.message,
    });
  }
};

// Verify Email
// POST /api/auth/verify-email
// Private
const verifyEmail = async (req, res) => {
  const { userId } = req.user;
  const { otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({
      success: false,
      message: "UserId or OTP missing!",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Already verified!",
      });
    }

    if (!user.verifyOtp) {
      return res.status(400).json({
        success: false,
        message: "You must first send the OTP!",
      });
    }

    if (user.verifyOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP!",
      });
    }

    if (user.verifyOtpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired!",
      });
    }

    user.isVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiry = 0;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to verify email.",
      error: error.message,
    });
  }
};

// To check authentication
// GET /api/auth/is-auth
// Private
const isAuthenticated = (req, res) => {
  try {
    // if it reaches here, jwt middleware already verified the token
    return res.status(200).json({
      success: true,
      message: "Already logged in",
    });
  } catch (error) {
    // fallback in case something breaks
    return res.status(400).json({
      success: false,
      message: "Invalid token.",
      error: error.message,
    });
  }
};

// Send Password Reset OTP
// POST /api/auth/send-reset-otp
// Public
const sendResetOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
    };
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ success: true, message: "Reset OTP sent to your email." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send reset OTP.",
      error: error.message,
    });
  }
};

// Reset user password
// POST /api/auth/reset-password
// Public
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email, OTP, and new password are required.",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (user.resetOtp !== otp || user.resetOtp === "") {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP!",
      });
    }

    if (user.resetOtpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired!",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpiry = 0;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to reset password.",
      error: error.message,
    });
  }
};

// Delete my accouint
// POST /api/auth/delete-account
// Private
const deleteAccount = async (req, res) => {
  try {
    const { userId } = req.user; // assuming userId is added to req.user by your auth middleware

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    await User.findByIdAndDelete(userId);

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "Account deleted successfully." });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error." });
  }
};

export {
  register,
  login,
  logout,
  sendVerificationOTP,
  verifyEmail,
  isAuthenticated,
  sendResetOTP,
  resetPassword,
  deleteAccount,
};
