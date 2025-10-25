// models/categoryModel.js
import pool from "../config/db.js";

export const createFeadback =  async (req, res) => {
 
  try {
    const { name, email, category, message, allow_contact } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ message: "All required fields must be filled" });

    const conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO feedback (name, email, category, message, allow_contact) VALUES (?, ?, ?, ?, ?)",
      [name, email, category, message, allow_contact ? 1 : 0]
    );
    conn.release();

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving feedback" });
  }
}

export const getFeadback= async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query("SELECT * FROM feedback ORDER BY created_at DESC");
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching feedback" });
  }
}