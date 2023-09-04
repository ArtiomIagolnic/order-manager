import asyncHandler from "express-async-handler";
const dataPath = "./details/products.json";
import fs from "fs";

// @desc getting all customers
// route GET /api/customers/all
// @access public

const getAll = asyncHandler(async (req, res) => {
  const jsonData = fs.readFileSync(dataPath);
  const products = JSON.parse(jsonData);

  res.status(200).json(products);
});

// @desc add new customer
// route POST /api/customers/add
// @access public

const addProduct = asyncHandler(async (req, res) => {
  const newProduct = req.body;
  const jsonData = fs.readFileSync(dataPath);
  const products = JSON.parse(jsonData);
  if (newProduct) {
    products.push(newProduct);
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
    res.status(201).json({ message: "Product added successfully", newProduct });
  } else {
    res.status(404);
    throw new Error("Something went wrong");
  }
});

// @desc update customer
// route PUT /api/customers/update
// @access public
const updateProduct = asyncHandler(async (req, res) => {
  const updatedProduct = req.body;
  const productId = updatedProduct.id;

  const jsonData = fs.readFileSync(dataPath);
  const products = JSON.parse(jsonData);

  const productIndex = await products.findIndex(
    (product) => product.id === productId
  );
  if (productIndex === -1) {
    res.status(404);
    throw new Error("Product not found");
  } else {
    products[productIndex] = updatedProduct;
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));

    res
      .status(200)
      .json({ message: "Product updated successfully", updatedProduct });
  }
});

// @desc delete product
// route DELETE /api/products/delete
// @access public
const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  const jsonData = fs.readFileSync(dataPath);
  const products = JSON.parse(jsonData);

  const productIndex = await products.findIndex(
    (product) => product.id === productId
  );
  if (productIndex !== -1) {
    products.splice(productIndex, 1);

    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));

    res.status(200).json({ message: "Product was deleted successfully" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export { getAll, addProduct, updateProduct, deleteProduct};
