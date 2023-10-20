import express from "express";
const router = express.Router();
import { getLogs } from "../controllers/LogsController.js";

router.get("/all", getLogs);

export default router;
