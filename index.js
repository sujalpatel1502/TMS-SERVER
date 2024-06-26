import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
import cronJob from "./helper/cron.js";
import { db } from "./database/index.js";
const app = express();
app.use(bodyParser.json());
dotenv.config();
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
);

app.use("/api/user", userRoutes);
app.use("/api/bid", bidRoutes);

cronJob();

app.get("/", (req, res) => {
  res.send("Hello, Pandey Logistics");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at port ${process.env.PORT}`);
});
