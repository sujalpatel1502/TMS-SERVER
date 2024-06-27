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
    vendorid,
  } = req.body;
  console.log(req.body);

  try {
    await dbQueryAsync(
      "INSERT INTO bid (origin, destination, bidtype, reportTime, vendorName, weight, vehicletype, vehiclecount, bidstarttime, bidendtime, comments, status, origincord, destinationcord,vendorid) VALUES (?, ?, ?, NOW(), 'Sujal', ?, ?, ?, ?, ?, ?, 'Ongoing', ?, ?,?)",
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
        vendorid,
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

export const applyBid = async (req, res) => {
  // console.log("req", req.body);
  const { price, comment, bidid, userid, vendorid } = req.body;
  try {
    await dbQueryAsync(
      "INSERT INTO appliedbids (bidid,comments,price,userid,vendorid) VALUES (?,?,?,?,?)",
      [bidid, comment, price, userid, vendorid]
    );
    res
      .status(200)
      .json({ success: true, msg: "Bid applied successfully", status: "200" });
  } catch (error) {
    console.error("Error applying for Bid", error);
    res
      .status(500)
      .json({ success: false, error: "Error adding Bid", status: "500" });
  }
};

// export const getAppliedBids = async (req, res) => {
//   // console.log("r", req.params.id);
//   try {
//     const data = await dbQueryAsync(
//       "SELECT ab.*, b.*, u.* FROM appliedbids ab  JOIN bid b ON ab.bidid = b.id JOIN users u ON ab.userid = u.id WHERE ab.bidid = ?",

//       [req.params.id]
//     );
//     const filteredData = data.map(({ Password, ...rest }) => rest);
//     if (data.length == 0) {
//       res.status(404).json({
//         success: true,
//         error: "The bid is not available",
//         status: "404",
//       });
//     } else {
//       res.status(200).json({
//         success: true,
//         msg: "Bid fetched successfully",
//         data: filteredData,
//         status: "200",
//       });
//     }
//   } catch (error) {
//     console.log("error in getting applied bids", error);
//     res
//       .status(500)
//       .json({ success: false, error: "Error getting Bid", status: "500" });
//   }
// };
export const getAppliedBids = async (req, res) => {
  try {
    const data = await dbQueryAsync(
      `SELECT ab.*, b.*, 
              u1.id AS user_id, u1.name AS user_name, u1.email AS user_email, u1.phone AS user_phone, u1.usertype AS user_usertype, 
              u2.id AS vendor_id, u2.name AS vendor_name, u2.email AS vendor_email, u2.phone AS vendor_phone, u2.usertype AS vendor_usertype 
       FROM appliedbids ab  
       JOIN bid b ON ab.bidid = b.id 
       JOIN users u1 ON ab.userid = u1.id 
       JOIN users u2 ON ab.vendorid = u2.id 
       WHERE ab.bidid = ?`,
      [req.params.id]
    );

    if (data.length == 0) {
      res.status(404).json({
        success: true,
        error: "The bid is not available",
        status: "404",
      });
    } else {
      const filteredData = data.map((row) => {
        const { user_password, vendor_password, ...rest } = row;

        const userData = {
          id: row.user_id,
          name: row.user_name,
          email: row.user_email,
          phone: row.user_phone,
          usertype: row.user_usertype,
        };

        const vendorData = {
          id: row.vendor_id,
          name: row.vendor_name,
          email: row.vendor_email,
          phone: row.vendor_phone,
          usertype: row.vendor_usertype,
        };

        const {
          user_id,
          user_name,
          user_email,
          user_phone,
          user_usertype,
          vendor_id,
          vendor_name,
          vendor_email,
          vendor_phone,
          vendor_usertype,
          ...bidData
        } = rest;

        return {
          ...bidData,
          user: userData,
          vendor: vendorData,
        };
      });

      res.status(200).json({
        success: true,
        msg: "Bid fetched successfully",
        data: filteredData,
        status: "200",
      });
    }
  } catch (error) {
    console.log("error in getting applied bids", error);
    res
      .status(500)
      .json({ success: false, error: "Error getting Bid", status: "500" });
  }
};
