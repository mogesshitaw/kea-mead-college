// routes/newsRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import {
  createNews,
  getNews,
  getNewsByIdController,
  updateNews,
  deleteNews,
} from "../controllers/newsController.js";
import { authenticateToken, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer setup
const UPLOAD_DIR = "uploads";
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "-").toLowerCase();
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});
const upload = multer({ storage });

// Public
router.get("/", getNews);
router.get("/:id", getNewsByIdController);

// Protected admin endpoints (create/update/delete)
router.post("/", authenticateToken, authorizeAdmin, upload.single("image"), createNews);
router.put("/:id", authenticateToken, authorizeAdmin, upload.single("image"), updateNews);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteNews);

export default router;
