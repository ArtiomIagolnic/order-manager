import express from "express";
const router = express.Router();
import {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/OrdersController.js";

router.get("/all", getOrders);
router.post("/add", addOrder);
router.put("/update", updateOrder);
router.delete("/delete/:id", deleteOrder);

export default router;
