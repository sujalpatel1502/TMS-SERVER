import express from "express";
import {
  adminTransactionHistory,
  adminWalletBalance,
  adminWalletPay,
  adminWalletPurchase,
  bidPurchase,
  bidsPay,
} from "../controllers/bidPurchaseController.js";

const router = express.Router();

router.post("/bidPurchase/:userid", bidPurchase);
router.post("/bidsPay", bidsPay);
router.post("/adminWalletPurchase/:adminid", adminWalletPurchase);
router.post("/adminWalletPay", adminWalletPay);
router.get("/adminWalletBalance/:id", adminWalletBalance);
router.get("/adminTransactionHistory/:id", adminTransactionHistory);

export default router;
