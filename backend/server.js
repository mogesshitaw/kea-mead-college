// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import comentRoutes from "./routes/comentRoutes.js";
import applyRoutes from "./routes/applyRoutes.js";

dotenv.config();
const app = express();

// For ES module __dirname simulation
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());

// ✅ Remove duplicate express.json() call and set high limit
app.use(express.json());            // JSON body size limit
app.use(express.urlencoded({ limit: "50mb", extended: true })); // URL-encoded form data

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname
  , "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/feedback", comentRoutes);
app.use("/api/apply", applyRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Kiyamid College News Backend is running ✅");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

