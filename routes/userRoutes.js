import express from "express";
import {
  userSignup,
  verifyEmail,
  verifyOtp,
  submitTruckData,
  getTruckData,
} from "../controllers/userControllers.js";

const router = express.Router();

router.post("/userSignup", userSignup);
router.post("/verifyEmail", verifyEmail);
router.post("/verifyOtp", verifyOtp);
router.post("/submitTruckData", submitTruckData);
router.get("/getTruckData/:id", getTruckData);

export default router;
