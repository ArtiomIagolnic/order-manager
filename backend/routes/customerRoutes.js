import express from "express";
const router = express.Router();
import {
  getCustomers,
  getCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  exportCustomer,
} from "../controllers/CustomersController.js";

router.get("/all", getCustomers);
router.get("/one/:id", getCustomer);
router.post("/add", addCustomer);
router.put("/update", updateCustomer);
router.delete("/delete/:customers", deleteCustomer);
router.get("/export/:customers", exportCustomer);

export default router;
