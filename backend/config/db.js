// config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "moges",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "kiyamid_news",
  connectionLimit: 10,
});

export default pool;
