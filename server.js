// server.js
import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// MySQL connection check
try {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  console.log("✅ MySQL connected");
} catch (error) {
  console.error("❌ MySQL connection failed:", error.message);
  process.exit(1);
}

app.get("/", (req, res) => {
  res.send("🚀 Backend server running");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
