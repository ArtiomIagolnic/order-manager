import express from "express";
const router = express.Router();
import { getAll } from "../controllers/orderController.js";

router.get("/all", getAll);

export default router;
