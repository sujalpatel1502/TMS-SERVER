import cron from "node-cron";
import { dbQueryAsync } from "../helper/index.js";

// Function to format the current date and time in local time zone (IST) in YYYY-MM-DD HH:MM:SS format
const getLocalTimeFormatted = () => {
  const now = new Date();
  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  const formatter = new Intl.DateTimeFormat("en-GB", options);
  const [
    { value: day },
    ,
    { value: month },
    ,
    { value: year },
    ,
    { value: hour },
    ,
    { value: minute },
    ,
    { value: second },
  ] = formatter.formatToParts(now);

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

const checkAndExpireBids = async () => {
  console.log(
    "Running cron job to check and expire bids at",
    getLocalTimeFormatted()
  );
  const nowFormatted = getLocalTimeFormatted();

  //   WHERE id IS NOT NULL AND status = 'active' AND DATE_ADD(startTime, INTERVAL duration MINUTE) <= ?
  const query = `
  UPDATE bid
  SET status = 'expired'
  WHERE id IS NOT NULL AND status = 'Ongoing' AND bidendtime <= ?
`;

  try {
    // console.log("----", nowFormatted);
    const results = await dbQueryAsync(query, [nowFormatted]);
    console.log(`Expired ${results.affectedRows} bids`);
  } catch (error) {
    console.error("Error updating bids:", error);
  }
};

const checkAndUploadBids = async () => {
  console.log(
    "Running cron job to check and Upload bids at",
    getLocalTimeFormatted()
  );
  const nowFormatted = getLocalTimeFormatted();

  //   WHERE id IS NOT NULL AND status = 'active' AND DATE_ADD(startTime, INTERVAL duration MINUTE) <= ?
  const query = `
  UPDATE bid
  SET status = 'Ongoing'
  WHERE id IS NOT NULL AND status = 'Uploaded' AND bidstarttime <= ?
`;

  try {
    // console.log("----", nowFormatted);
    const results = await dbQueryAsync(query, [nowFormatted]);
    console.log(`Uploaded ${results.affectedRows} bids`);
  } catch (error) {
    console.error("Error updating bids:", error);
  }
};

cron.schedule("* * * * *", checkAndExpireBids);
cron.schedule("* * * * *", checkAndUploadBids);

export default checkAndExpireBids;
