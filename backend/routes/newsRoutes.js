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

const router = express.Router();

// Multer setup
// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // upload folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  },
});

const upload = multer({ storage });


// Public
router.get("/", getNews);
router.get("/:id", getNewsByIdController);

// Protected admin endpoints (create/update/delete)
router.post("/", upload.single("image"), createNews);
router.put("/:id",upload.single("image"), updateNews);
router.delete("/:id",  deleteNews);

export default router;