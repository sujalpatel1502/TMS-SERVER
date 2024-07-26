import razorpay from "razorpay";
import { db } from "../database/index.js";
import { dbQueryAsync } from "../helper/index.js";
import axios from "axios";

const instance = new razorpay({
  key_id: "rzp_test_Lq5js1CABxRRU2",
  key_secret: "SNbAVBQRBZ0a99pCwcjBgBMK",
});

// export const createFundAccountUser = async (req, res) => {
//   const { accountNumber, ifsc, name, contact } = req.body;
//   console.log("Request body:", req.body);
//   const key_id = "rzp_test_Lq5js1CABxRRU2";
//   const key_secret = "SNbAVBQRBZ0a99pCwcjBgBMK";
//   const auth = Buffer.from(`${key_id}:${key_secret}`).toString("base64");

//   const contactData = {
//     name,
//     contact,
//   };

//   try {
//     console.log("calleddddddd");
//     const response = await axios.post(
//       "https://api.razorpay.com/v1/contacts",
//       contactData,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Basic ${auth}`,
//         },
//       }
//     );

//     console.log("Contact created:", response.data);

//     const fundAccountResponse = await instance.fundAccount.create({
//       contact_id: response.data.id,
//       account_type: "bank_account",
//       bank_account: {
//         name: name,
//         ifsc: ifsc,
//         account_number: accountNumber,
//       },
//     });
//     // fa_OaQK8scACXxuGu
//     console.log("Fund account created:", fundAccountResponse);

//     res.status(200).json({
//       success: true,
//       fund_account_id: fundAccountResponse.id,
//     });
//   } catch (error) {
//     console.error("Error creating fund account:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const createUserpayout = async (req, res) => {
//   const { amount, currency, vendorId, mode, purpose } = req.body;
//   console.log("------------");

//   // try {
//   //   // Fetch vendor's fund account ID from your database
//   //   // const fundAccountId = await getVendorFundAccountId(vendorId);

//   //   const payout = await instance.payouts.create({
//   //     account_number: "7878780080316316", // Your Razorpay account number
//   //     fund_account_id: "fa_OaQK8scACXxuGu",
//   //     amount: 500 * 100, // Amount in smallest currency unit (e.g., paise)
//   //     currency: "INR",
//   //     mode: "IMPS",
//   //     purpose: "payout",
//   //     queue_if_low_balance: true,
//   //   });

//   //   res.status(200).json({
//   //     success: true,
//   //     payout_id: payout.id,
//   //   });
//   // } catch (error) {
//   //   res.status(500).json({
//   //     success: false,
//   //     message: error.message,
//   //   });
//   // }

//   const key_id = "rzp_test_Lq5js1CABxRRU2";
//   const key_secret = "SNbAVBQRBZ0a99pCwcjBgBMK";
//   const auth = Buffer.from(`${key_id}:${key_secret}`).toString("base64");

//   const payoutData = {
//     account_number: "7878780080316316",
//     fund_account_id: "fa_00000000000001",
//     amount: 1000000,
//     currency: "INR",
//     mode: "IMPS",
//     purpose: "refund",
//     queue_if_low_balance: true,
//     reference_id: "Acme Transaction ID 12345",
//     narration: "Acme Corp Fund Transfer",
//     notes: {
//       notes_key_1: "Tea, Earl Grey, Hot",
//       notes_key_2: "Tea, Earl Grey… decaf.",
//     },
//   };

//   try {
//     const response = await axios.post(
//       "https://api.razorpay.com/v1/payouts",
//       payoutData,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Basic ${auth}`,
//         },
//       }
//     );

//     console.log("Payout created:", response.data);
//   } catch (error) {
//     console.error(
//       "Error creating payout:",
//       error.response ? error.response.data : error.message
//     );
//   }
// };

export const bidPurchase = async (req, res) => {
  const userId = req.params.userid;
  const bids = req.body;

  const options = {
    amount: bids.price * 100,
    currency: "INR",
    receipt: `order_${userId}_${Date.now()}`,
    payment_capture: 1,
  };

  instance.orders.create(options, function (err, order) {
    if (err) {
      console.error("Error creating Razorpay order:", err);
      return res.status(500).json({ error: "Failed to create Razorpay order" });
    } else {
      console.log("order----", order);
      const razorpay_order_id = order.id;

      // Return Razorpay leads, order ID and amount in the response
      res.json({
        success: true,
        bids: bids,
        razorpay_order_id: razorpay_order_id,
        total_amount: bids.price,
      });
    }
  });
};

export const adminWalletPurchase = async (req, res) => {
  const adminid = req.params.adminid;
  console.log(req.body);
  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `order_${adminid}_${Date.now()}`,
    payment_capture: 1,
  };

  instance.orders.create(options, function (err, order) {
    if (err) {
      console.error("Error creating Razorpay order:", err);
      return res.status(500).json({ error: "Failed to create Razorpay order" });
    } else {
      console.log("order----", order);
      const razorpay_order_id = order.id;

      // Return Razorpay leads, order ID and amount in the response
      res.json({
        success: true,
        razorpay_order_id: razorpay_order_id,
        total_amount: amount,
      });
    }
  });
};

export const bidsPay = async (req, res) => {
  const {
    currency,
    vendorId,
    razorpaySignature,
    razorpayOrderId,
    leads,
    razorpayPaymentId,
    totalPrice,
    email,
  } = req.body;
};

export const adminWalletPay = async (req, res) => {
  const {
    currency,
    adminId,
    razorpaySignature,
    razorpayOrderId,
    razorpayPaymentId,
    totalPrice,
  } = req.body;
  const checkVendorSQL = "SELECT * FROM admin_balance WHERE admin_id = ?";
  db.query(checkVendorSQL, [adminId], (err, rows) => {
    if (err) {
      console.error("Error checking admin balance:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (rows.length > 0) {
      const updateBalanceSQL =
        "UPDATE admin_balance SET amount = amount + ? WHERE admin_id = ?";
      db.query(
        updateBalanceSQL,
        [totalPrice, adminId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Error updating admin balance:", updateErr);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            const insertWalletSQL =
              "INSERT INTO admin_wallet (total_amount, admin_id, razorpay_order_id, currency, razorpay_signature, razorpay_payment_id) VALUES (?, ?, ?, ?, ?, ?)";
            db.query(
              insertWalletSQL,
              [
                totalPrice,
                adminId,
                razorpayOrderId,
                currency,
                razorpaySignature,
                razorpayPaymentId,
              ],
              (insertErr, insertResult) => {
                if (insertErr) {
                  console.error(
                    "Error inserting into admin wallet:",
                    insertErr
                  );
                  res.status(500).json({ error: "Internal Server Error" });
                } else {
                  res.json({ success: true });
                }
              }
            );
          }
        }
      );
    } else {
      const insertBalanceSQL =
        "INSERT INTO admin_balance (admin_id, amount) VALUES (?, ?)";

      db.query(
        insertBalanceSQL,
        [adminId, totalPrice],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error inserting into admin_balance:", insertErr);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            // Insert payment details into wallet table
            const insertWalletSQL =
              "INSERT INTO admin_wallet (total_amount, admin_id, razorpay_order_id, currency, razorpay_signature, razorpay_payment_id) VALUES (?, ?, ?, ?, ?, ?)";
            db.query(
              insertWalletSQL,
              [
                totalPrice,
                adminId,
                razorpayOrderId,
                currency,
                razorpaySignature,
                razorpayPaymentId,
              ],
              (insertErr, insertResult) => {
                if (insertErr) {
                  console.error(
                    "Error inserting into admin wallet:",
                    insertErr
                  );
                  res.status(500).json({ error: "Internal Server Error" });
                } else {
                  res.json({ success: true });
                }
              }
            );
          }
        }
      );
    }
  });
};

export const adminWalletBalance = async (req, res) => {
  const adminId = req.params.id;
  const sql = `SELECT amount FROM admin_balance WHERE admin_id = ? `;
  db.query(sql, [adminId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json({ balance: results });
  });
};

export const adminTransactionHistory = async (req, res) => {
  console.log("came------");
  const adminId = req.params.id;

  const sql1 = `SELECT total_amount, created_at, razorpay_payment_id FROM admin_wallet WHERE admin_id = ? AND razorpay_payment_id IS NOT NULL ORDER BY created_at DESC`;

  try {
    const result2 = await dbQueryAsync(sql1, [adminId]);

    const combinedResults = [...result2];

    const filteredResults = combinedResults.filter(
      (result) => result.razorpay_payment_id
    );

    filteredResults.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    res.send({ success: true, transactionHistory: filteredResults });
  } catch (error) {
    console.log(error.message);
    res.send({ success: false, error: error.message });
  }
};
