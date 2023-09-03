import asyncHandler from "express-async-handler";
const dataPath = "./details/orders.json";
import fs from "fs";

// @desc getting all customers
// route GET /api/customers/all
// @access public

const getAll = asyncHandler(async (req, res) => {
  const jsonData = fs.readFileSync(dataPath);
  const orders = JSON.parse(jsonData);

  res.status(200).json(orders);
});

// @desc add new customer
// route POST /api/customers/add
// @access public

const addOrder = asyncHandler(async (req, res) => {
  const newOrder = req.body;
  const jsonData = fs.readFileSync(dataPath);
  const orders = JSON.parse(jsonData);
  if (newOrder) {
    orders.push(newOrder);
    fs.writeFileSync(dataPath, JSON.stringify(orders, null, 2));
    res.status(201).json({ message: "Product added successfully", newOrder });
  } else {
    res.status(404);
    throw new Error("Something went wrong");
  }
});

// @desc update customer
// route PUT /api/customers/update
// @access public
const updateOrder = asyncHandler(async (req, res) => {
  const updatedOrder = req.body;
  const orderId = updatedOrder.id;

  const jsonData = fs.readFileSync(dataPath);
  const orders = JSON.parse(jsonData);

  const orderIndex = await orders.findIndex((order) => order.id === orderId);
  if (orderIndex === -1) {
    res.status(404);
    throw new Error("Order not found");
  } else {
    orders[orderIndex] = updatedOrder;
    fs.writeFileSync(dataPath, JSON.stringify(orders, null, 2));

    res
      .status(200)
      .json({ message: "Order updated successfully", updatedOrder });
  }
});

// @desc delete customer
// route DELETE /api/customers/delete
// @access public
const deleteOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  const jsonData = fs.readFileSync(dataPath);
  const orders = JSON.parse(jsonData);

  const orderIndex = await orders.findIndex(
    (product) => product.id === orderId
  );
  if (orderIndex !== -1) {
    orders.splice(orderIndex, 1);

    fs.writeFileSync(dataPath, JSON.stringify(orders, null, 2));

    res.status(200).json({ message: "Order was deleted successfully" });
  } else {
    res.status(404);
    throw new Error("order not found");
  }
});

export { getAll, addOrder, updateOrder, deleteOrder };
