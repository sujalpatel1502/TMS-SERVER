import express from "express";
import { addBid } from "../controllers/bidControllers.js";

const router = express.Router();

router.post("/addBid", addBid);

export default router;
