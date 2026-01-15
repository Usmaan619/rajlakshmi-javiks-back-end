const asyncHandler = require("express-async-handler");
const forgotPasswordModal = require("../../../model/users/rajlaxmi/forgotPasswordModel");
const bcrypt = require("bcryptjs");

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const hostname = req.hostname;
  console.log(req.body);
  try {
    const user = await forgotPasswordModal.findUserByEmail(email);
    if (!user) {
      return res.json({ message: "Email not found" });
    }
    // console.log(user)

    const otp = await forgotPasswordModal.sendOTPEmail(user?.email, hostname);
    console.log("otp", otp);

    res.json({ message: "OTP sent your email successfully." });
  } catch (error) {
    console.error("Error is sending OTP email:", error);
    res.json({ message: "Server error", error });
    // throw error;
  }
});

exports.verifyOtp = asyncHandler(async (req, res) => {
  try {
    const { otp } = req.body;

    const reset = await forgotPasswordModal.findUserByOTP(otp);
    if (!reset) {
      return res.json({ success: false, message: "OTP does not found" });
    }

    //check otp same or not
    if (reset.otp !== otp) {
      return res.json({ success: false, message: "OTP does not same" });
    }

    // await user.save();
    res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    res.json({ message: "Server error" });
  }
});

// //   Re-set password
exports.passwordReset = asyncHandler(async (req, res) => {
  const { otp, newPassword } = req.body;
  console.log(req.body);

  // Validation: Check if newPassword
  if (!newPassword) {
    return res.json({ message: "New password is required" });
  }

  const reset = await forgotPasswordModal.findUserByOTP(otp);
  if (!reset) {
    return res.json({ message: "OTP does not found" });
  }
  console.log(reset);
  try {
    //check otp same or not
    if (reset.otp !== otp) {
      return res.json({ message: "OTP does not same" });
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    await forgotPasswordModal.resetPassword(reset.email, hashedPassword);

    // await user.save();
    res.json({ message: "password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
