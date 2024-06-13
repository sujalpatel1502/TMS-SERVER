import {
  dbQueryAsync,
  generateVerificationCode,
  sendMail,
} from "../helper/index.js";

export const addBid = async (req, res) => {
  const {
    origin,
    destination,
    reportTime,
    vendorName,
    weight,
    vehicletype,
    vehiclecount,
    comments,
    duration,
    bidtype,
    status,
  } = req.body;

  try {
    await dbQueryAsync(
      "INSERT INTO bid (origin, destination, reportTime, vendorName, weight,vehicletype,vehiclecount,comments,duration,bidtype,status) VALUES (?, ?, ?,?, ?, ?, ?,?,?,?,?)",
      [
        origin,
        destination,
        reportTime,
        vendorName,
        weight,
        vehicletype,
        vehiclecount,
        comments,
        duration,
        bidtype,
        status,
      ]
    );
    res.status(201).json({ success: true, msg: "Bid inserted successfully" });
  } catch (error) {
    console.error("Error adding Bid", error);
    res.status(500).json({ success: false, error: "Error adding Bid" });
  }
};
