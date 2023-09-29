import express from "express";
const router = express.Router();
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/ProductsController.js";

router.get("/all", getProducts);
router.post("/add", addProduct);
router.put("/update", updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
