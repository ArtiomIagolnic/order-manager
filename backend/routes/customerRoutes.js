import express from "express";
const router = express.Router();
import {
  getCustomers,
  getCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/CustomersController.js";

router.get("/all", getCustomers);
router.get("/one/:id", getCustomer);
router.post("/add", addCustomer);
router.put("/update", updateCustomer);
router.delete("/delete/:id", deleteCustomer);

export default router;
