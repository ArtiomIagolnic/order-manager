import express from "express";
const router = express.Router();
import {
  getAll,
  addProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
} from "../controllers/productController.js";

router.get("/all", getAll);
router.post("/add", addProduct);
router.put("/update", updateProduct);
router.put("/product-stock", updateProductStock);
router.delete("/delete/:id", deleteProduct);

export default router;
