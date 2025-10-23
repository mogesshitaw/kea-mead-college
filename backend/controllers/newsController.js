// controllers/newsController.js
import path from "path";
import fs from "fs";
import {
  createNews as createNewsModel,
  getAllNews,
  getNewsById,
  updateNews as updateNewsModel,
  deleteNews as deleteNewsModel,
} from "../models/newsModel.js";

const UPLOAD_DIR = "uploads";

const removeFileIfExists = (filename) => {
  if (!filename) return;
  const p = path.join(process.cwd(), UPLOAD_DIR, filename);
  if (fs.existsSync(p)) {
    try { fs.unlinkSync(p); } catch (err) { console.warn("Failed to delete file", p, err); }
  }
};

export const createNews = async (req, res) => {
  try {
    const { title, content, category_id, author } = req.body;
    const image = req.file ? req.file.filename : null;
    if (!title || !content) return res.status(400).json({ message: "title & content required" });

    const result = await createNewsModel({ title, content, image, category_id: category_id || null, author: author || null });
    res.status(201).json({ message: "News created", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getNews = async (req, res) => {
  try {
    const rows = await getAllNews();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getNewsByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    const row = await getNewsById(id);
    if (!row) return res.status(404).json({ message: "News not found" });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updateNews = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content, category_id, author } = req.body;
    const newImage = req.file ? req.file.filename : null;

    const existing = await getNewsById(id);
    if (!existing) {
      if (newImage) removeFileIfExists(newImage); // cleanup uploaded file
      return res.status(404).json({ message: "News not found" });
    }

    // if new image uploaded, delete old
    if (newImage && existing.image) removeFileIfExists(existing.image);

    const payload = {
      title: title ?? existing.title,
      content: content ?? existing.content,
      category_id: category_id ?? existing.category_id,
      author: author ?? existing.author,
      image: newImage ?? existing.image,
    };

    const result = await updateNewsModel(id, payload);
    if (result.affectedRows === 0) return res.status(400).json({ message: "Nothing updated" });
    res.json({ message: "News updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await getNewsById(id);
    if (!existing) return res.status(404).json({ message: "News not found" });

    // Delete DB record
    const result = await deleteNewsModel(id);
    if (result.affectedRows === 0) return res.status(400).json({ message: "Failed to delete" });

    // Delete file if present
    if (existing.image) removeFileIfExists(existing.image);
    res.json({ message: "News deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
