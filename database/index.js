import mysql2 from "mysql2";
import dotenv from "dotenv";
dotenv.config();
export const db = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  timezone: "+00:00",
  connectTimeout: 20000,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Close the database connection on application exit
process.on("SIGINT", () => {
  db.end((err) => {
    if (err) {
      console.error("Error closing MySQL connection:", err);
    }
    console.log("MySQL connection closed");
    process.exit();
  });
});
