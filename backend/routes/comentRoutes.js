
import express from "express";
import { createFeadback,getFeadback } from "../controllers/comentController.js";

const router = express.Router();

router.post("/", createFeadback);
router.get("/", getFeadback);

export default router;
