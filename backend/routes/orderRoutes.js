import express from "express";
const router = express.Router();
import {
  getAll,
  addOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

router.get("/all", getAll);
router.post("/add", addOrder);
router.put("/update", updateOrder);
router.delete("/delete/:id", deleteOrder);

export default router;
