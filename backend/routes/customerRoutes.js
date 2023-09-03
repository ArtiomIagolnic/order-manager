import express from "express";
const router = express.Router();
import {
  getAll,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";

router.get("/all", getAll);
router.post("/add", addCustomer);
router.put("/update", updateCustomer);
router.delete("/delete/:id", deleteCustomer);

export default router;
