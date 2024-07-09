import express from "express";
import {
  addBid,
  getBids,
  singleBid,
  applyBid,
  getAppliedBids,
  getActiveBids,
  getCompleteBids,
  wonBid,
  getAcceptedBids,
  getAcceptedBidsById,
} from "../controllers/bidControllers.js";

const router = express.Router();

router.post("/addBid", addBid);
router.get("/allBid", getBids);
router.get("/singleBid/:id", singleBid);
router.post("/applyBid", applyBid);
router.get("/getAppliedBids/:id", getAppliedBids);
router.get("/getActiveBids", getActiveBids);
router.get("/getCompleteBids", getCompleteBids);
router.get("/getAcceptedBids", getAcceptedBids);
router.get("/getAcceptedBids/:id", getAcceptedBidsById);
router.post("/wonBid/:id", wonBid);

export default router;
