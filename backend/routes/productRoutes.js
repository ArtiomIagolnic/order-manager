import express from "express";
const router = express.Router();
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  exportProduct,
} from "../controllers/ProductsController.js";

router.get("/all", getProducts);
router.post("/add", addProduct);
router.put("/update", updateProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/export/:products", exportProduct);

export default router;
