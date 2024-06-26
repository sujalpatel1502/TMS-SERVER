import express from "express";
import { addBid, getBids, singleBid } from "../controllers/bidControllers.js";

const router = express.Router();

router.post("/addBid", addBid);
router.get("/allBid", getBids);
router.get("/singleBid/:id", singleBid);

export default router;
