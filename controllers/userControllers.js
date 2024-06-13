import { db } from "../database/index.js";
import bcrypt from "bcrypt";
import {
  dbQueryAsync,
  generateVerificationCode,
  sendMail,
} from "../helper/index.js";

export const userSignup = async (req, res) => {
  const { Name, Email, Password, Phone, UserType } = req.body;
  const hashedPassword = await bcrypt.hash(Password, 10);
  try {
    const existingUser = await dbQueryAsync(
      "SELECT Email,Phone FROM users WHERE Email = ? or Phone =  ? ",
      [Email, Phone]
    );
    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "Email already exists" });
    } else {
      await dbQueryAsync(
        "INSERT INTO users (Name, Email, Password,Phone,UserType) VALUES (?, ?, ?,?, ?)",
        [Name, Email, hashedPassword, Phone, UserType]
      );
      res
        .status(201)
        .json({ success: true, msg: "User inserted successfully" });
    }
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
export const verifyEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const userCheckQuery = "SELECT * FROM users WHERE email = ?";
    const users = await dbQueryAsync(userCheckQuery, [email]);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: "You are not registered to our panel",
      });
    }
    if (users.length > 0) {
      const verificationCode = generateVerificationCode();

      const insertVerificationQuery = `
        INSERT INTO otp (email, code)
        VALUES (?, ?)`;

      await dbQueryAsync(insertVerificationQuery, [email, verificationCode]);

      // Optionally send the email here
      sendMail(email, "Email Verification", `OTP is ${verificationCode}`);

      return res.status(200).json({
        success: true,
        msg: "Verification email sent successfully!",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Check if the verification code matches
    const checkVerificationQuery = `
      SELECT * FROM otp
      WHERE email = ? AND code = ?`;

    const [verificationRecord] = await dbQueryAsync(checkVerificationQuery, [
      email,
      otp,
    ]);

    if (verificationRecord) {
      // Update the record to mark it as verified
      const updateVerificationQuery = `
        UPDATE otp
        SET verified = true
        WHERE email = ? AND code = ?`;

      await dbQueryAsync(updateVerificationQuery, [email, otp]);

      // Delete the verification record
      const deleteVerificationQuery = `
        DELETE FROM otp
        WHERE email = ?`;

      await dbQueryAsync(deleteVerificationQuery, [email]);

      res.status(200).json({
        success: true,
        msg: "OTP verified successfully!",
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Invalid verification code",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
