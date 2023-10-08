import express from "express";
const router = express.Router();
import {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  exportOrder,
} from "../controllers/OrdersController.js";

router.get("/all", getOrders);
router.post("/add", addOrder);
router.put("/update", updateOrder);
router.delete("/delete/:orders", deleteOrder);
router.get("/export/:orders", exportOrder);

export default router;
