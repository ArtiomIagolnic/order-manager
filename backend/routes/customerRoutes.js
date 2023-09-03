import express from "express";
const router = express.Router();
import { getAll } from "../controllers/customerController.js";

router.get("/all", getAll);

export default router;
