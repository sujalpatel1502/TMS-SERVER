import express from "express";
import {
  addBid,
  getBids,
  singleBid,
  applyBid,
  getAppliedBids,
} from "../controllers/bidControllers.js";

const router = express.Router();

router.post("/addBid", addBid);
router.get("/allBid", getBids);
router.get("/singleBid/:id", singleBid);
router.post("/applyBid", applyBid);
router.get("/getAppliedBids/:id", getAppliedBids);

export default router;
