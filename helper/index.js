import { db } from "../database/index.js";
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
export const dbQueryAsync = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

let mailTranspotar = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.emailID,
    pass: process.env.pwd,
  },
});

export const sendMail = (to, subject, message) => {
  let details = {
    from: process.env.emailID,
    to: to,
    subject: subject,
    // html: message,
    text: message,
  };

  mailTranspotar.sendMail(details, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
