import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";

// @desc getting all customers
// route GET /api/customers/all
// @access public

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.getAll();
  res.status(200).json(orders);
});

// @desc add new customer
// route POST /api/customers/add
// @access public

const addOrder = asyncHandler(async (req, res) => {
  const orderToAdd = req.body;
  const addedOrder = await Order.insert(orderToAdd);
  res.status(201).json(addedOrder);
});

// @desc update customer
// route PUT /api/customers/update
// @access public
const updateOrder = asyncHandler(async (req, res) => {
  const orderId = req.body.id;
  const orderToUpdate = req.body;
  const updatedOrder = await Order.update(orderId, orderToUpdate);
  res.status(200).json(updatedOrder);
});

// @desc delete customer
// route DELETE /api/customers/delete
// @access public
const deleteOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const deletedOrder = await Order.delete(orderId);
  res.status(204).send(deletedOrder.id);
});

const exportOrder = asyncHandler(async (req, res) => {});
export { getOrders, addOrder, updateOrder, deleteOrder,exportOrder };
