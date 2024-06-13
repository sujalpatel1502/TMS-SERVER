import express from "express";
import {
  userSignup,
  verifyEmail,
  verifyOtp,
} from "../controllers/userControllers.js";

const router = express.Router();

router.post("/userSignup", userSignup);
router.post("/verifyEmail", verifyEmail);
router.post("/verifyOtp", verifyOtp);

export default router;
