import express from "express";
const router = express.Router();

import { getExports, deleteExport } from "../controllers/ExportsController.js";

router.get("/all", getExports);
router.delete("/delete/:exports", deleteExport);

export default router;