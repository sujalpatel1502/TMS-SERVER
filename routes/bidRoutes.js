import express from "express";
import {
  addBid,
  getBids,
  singleBid,
  applyBid,
  getAppliedBids,
  getActiveBids,
  getCompleteBids,
} from "../controllers/bidControllers.js";

const router = express.Router();

router.post("/addBid", addBid);
router.get("/allBid", getBids);
router.get("/singleBid/:id", singleBid);
router.post("/applyBid", applyBid);
router.get("/getAppliedBids/:id", getAppliedBids);
router.get("/getActiveBids", getActiveBids);
router.get("/getCompleteBids", getCompleteBids);

export default router;
