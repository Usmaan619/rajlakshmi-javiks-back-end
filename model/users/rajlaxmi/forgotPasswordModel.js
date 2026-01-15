const {
  forgetPasswordTemplate,
} = require("../../../emailTemplates/forgetPasswordTemplate");
const {
  createEmailTransporter,
  withConnection,
} = require("../../../utils/helper");

/**
 * Generate 6-digit OTP
 */
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

/**
 * Save OTP for a specific user
 */
const saveUserOTP = async (email, otp) => {
  try {
    return await withConnection(async (connection) => {
      const query = `UPDATE rajlaxmi_user SET otp = ? WHERE email = ?`;
      await connection.execute(query, [otp, email]);
    });
  } catch (error) {
    console.error("Error saving OTP:", error);
    throw error;
  }
};

/**
 * Send OTP Email
 */
exports.sendOTPEmail = async (to, hostname) => {
  try {
    const otp = generateOTP();
    const transporter = await createEmailTransporter();

    const mailOptions = {
      from: process.env.SMTP_SIW_USER,
      to,
      subject: "Forgot Password",
      text: `Your OTP for resetting your password is: ${otp}`,
      html: forgetPasswordTemplate(otp, hostname),
    };

    await transporter.sendMail(mailOptions);
    await saveUserOTP(to, otp);

    return { message: "OTP sent successfully" };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

/**
 * Find user by email
 */
exports.findUserByEmail = async (user_email) => {
  try {
    return await withConnection(async (connection) => {
      const query = `SELECT * FROM rajlaxmi_user WHERE email = ?`;
      const [rows] = await connection.execute(query, [user_email]);
      return rows[0] || null;
    });
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

/**
 * Find user by OTP
 */
exports.findUserByOTP = async (otp) => {
  try {
    return await withConnection(async (connection) => {
      const query = `SELECT * FROM rajlaxmi_user WHERE otp = ?`;
      const [rows] = await connection.execute(query, [otp]);
      return rows[0] || null;
    });
  } catch (error) {
    console.error("Error finding user by OTP:", error);
    throw error;
  }
};

/**
 * Reset Password
 */
exports.resetPassword = async (user_email, hashedPassword) => {
  try {
    return await withConnection(async (connection) => {
      const query = `
        UPDATE rajlaxmi_user
        SET password = ?, otp = NULL
        WHERE email = ?
      `;

      const [result] = await connection.execute(query, [
        hashedPassword,
        user_email,
      ]);

      if (result.affectedRows === 0) {
        throw new Error("User not found");
      }

      return { message: "Password reset successfully" };
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};
