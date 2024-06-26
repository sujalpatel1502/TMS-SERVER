import { dbQueryAsync } from "../helper/index.js";
export const addBid = async (req, res) => {
  const {
    origin,
    destination,
    bidType,
    weight,
    vehicleType,
    vehicleCount,
    fromDatetime,
    toDatetime,
    comment,
    fromcor,
    tocor,
  } = req.body;
  // console.log(req.body);

  try {
    await dbQueryAsync(
      "INSERT INTO bid (origin, destination, bidtype, reportTime, vendorName, weight, vehicletype, vehiclecount, bidstarttime, bidendtime, comments, status, origincord, destinationcord) VALUES (?, ?, ?, NOW(), 'Sujal', ?, ?, ?, ?, ?, ?, 'Ongoing', ?, ?)",
      [
        origin,
        destination,
        bidType,
        weight,
        vehicleType,
        vehicleCount,
        fromDatetime,
        toDatetime,
        comment,
        JSON.stringify(fromcor),
        JSON.stringify(tocor),
      ]
    );

    res
      .status(200)
      .json({ success: true, msg: "Bid inserted successfully", status: "200" });
  } catch (error) {
    console.error("Error adding Bid", error);
    res
      .status(500)
      .json({ success: false, error: "Error adding Bid", status: "500" });
  }
};
export const getBids = async (req, res) => {
  try {
    const data = await dbQueryAsync("SELECT * FROM bid WHERE status = ?", [
      "Ongoing",
    ]);
    // console.log("dataaa", data);
    if (data) {
      res.status(200).json({
        success: true,
        msg: "Bids fetched successfully",
        data: data,
        status: "200",
      });
    }
  } catch (error) {
    console.log("error in getting all bids", error);
    res
      .status(500)
      .json({ success: false, error: "Error getting all Bid", status: "500" });
  }
};
export const singleBid = async (req, res) => {
  try {
    const data = await dbQueryAsync("SELECT * FROM bid WHERE id = ?", [
      req.params.id,
    ]);
    console.log("daaaaaaa", data);
    if (data.length == 0) {
      res.status(404).json({
        success: true,
        error: "The bid is not available",
        status: "404",
      });
    } else {
      res.status(200).json({
        success: true,
        msg: "Bid fetched successfully",
        data: data,
        status: "200",
      });
    }
  } catch (error) {
    console.log("error in getting all bids", error);
    res
      .status(500)
      .json({ success: false, error: "Error getting Bid", status: "500" });
  }
};
