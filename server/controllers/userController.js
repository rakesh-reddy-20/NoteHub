import User from "../models/userModel.js";

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId).select(
      "-password -resetOtp -resetOtpExpiry -verifyOtp -verifyOtpExpiry"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get user profile.",
      error: error.message,
    });
  }
};

export { getUserProfile };
