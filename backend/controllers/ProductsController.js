import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

// @desc getting all customers
// route GET /api/customers/all
// @access public

const getProducts = asyncHandler(async (req, res) => {
  Product.getAll((err, products) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json(products);
  });
});

// @desc add new customer
// route POST /api/customers/add
// @access public

const addProduct = asyncHandler(async (req, res) => {
  Product.insert(req.body, (err, product) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(201).json(product);
  });
});

// @desc update customer
// route PUT /api/customers/update
// @access public
const updateProduct = asyncHandler(async (req, res) => {
  Product.update(req.body.id, req.body, (err, updatedProduct) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json(updatedProduct);
  });
});

// @desc delete product
// route DELETE /api/products/delete
// @access public
const deleteProduct = asyncHandler(async (req, res) => {
  Product.delete(req.params.id, (err, deletedProduct) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(204).send(deletedProduct);
  });
});

export { getProducts, addProduct, updateProduct, deleteProduct };
