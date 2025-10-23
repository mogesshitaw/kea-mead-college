// models/newsModel.js
import pool from "../config/db.js";

export const createNews = async ({ title, content, image = null, category_id = null, author = null }) => {
  const [result] = await pool.query(
    "INSERT INTO news (title, content, image, category_id, author) VALUES (?, ?, ?, ?, ?)",
    [title, content, image, category_id, author]
  );
  return result;
};

export const getAllNews = async () => {
  // join with categories to return category name
  const [rows] = await pool.query(
    `SELECT n.*, c.name as category_name
     FROM news n
     LEFT JOIN categories c ON n.category_id = c.id
     ORDER BY n.created_at DESC`
  );
  return rows;
};

export const getNewsById = async (id) => {
  const [rows] = await pool.query(
    `SELECT n.*, c.name as category_name
     FROM news n
     LEFT JOIN categories c ON n.category_id = c.id
     WHERE n.id = ? LIMIT 1`,
    [id]
  );
  return rows.length ? rows[0] : null;
};

export const updateNews = async (id, { title, content, image, category_id, author }) => {
  const [result] = await pool.query(
    `UPDATE news SET title = ?, content = ?, image = ?, category_id = ?, author = ? WHERE id = ?`,
    [title, content, image, category_id, author, id]
  );
  return result;
};

export const deleteNews = async (id) => {
  const [result] = await pool.query("DELETE FROM news WHERE id = ?", [id]);
  return result;
};
