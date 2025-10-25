// models/newsModel.js
import pool from "../config/db.js";

// Create
export const createNews = async ({ title, content, filename, category_id = null, author = null }) => {
  const [result] = await pool.query(
    `INSERT INTO news (title, content, image, category_id, author)
     VALUES (?, ?, ?, ?, ?)`,
    [title, content, filename, category_id, author]
  );
  return result;
};

// Get all news (with category name)
export const getAllNews = async () => {
  const [rows] = await pool.query(`
    SELECT n.*, c.name AS category_name
    FROM news n
    LEFT JOIN categories c ON n.category_id = c.id
    ORDER BY n.created_at DESC
  `);
  return rows;
};

// Get one by ID
export const getNewsById = async (id) => {
  const [rows] = await pool.query(
    `SELECT n.*, c.name AS category_name
     FROM news n
     LEFT JOIN categories c ON n.category_id = c.id
     WHERE n.id = ? LIMIT 1`,
    [id]
  );
  return rows.length ? rows[0] : null;
};

// Update
export const updateNews = async (id, { title, content, image, category_id, author }) => {
  const [result] = await pool.query(
    `UPDATE news SET title = ?, content = ?, image = ?, category_id = ?, author = ? WHERE id = ?`,
    [title, content, image, category_id, author, id]
  );
  return result;
};

// Delete
export const deleteNews = async (id) => {
  const [result] = await pool.query(`DELETE FROM news WHERE id = ?`, [id]);
  return result;
};
