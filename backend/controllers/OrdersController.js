import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";

// @desc getting all customers
// route GET /api/customers/all
// @access public

const getOrders = asyncHandler(async (req, res) => {
  Order.getAll((err, orders) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json(orders);
  });
});

// @desc add new customer
// route POST /api/customers/add
// @access public

const addOrder = asyncHandler(async (req, res) => {
  Order.insert(req.body, (err, order) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(201).json(order);
  });
});

// @desc update customer
// route PUT /api/customers/update
// @access public
const updateOrder = asyncHandler(async (req, res) => {
  Order.update(req.body.id, req.body, (err, updatedOrder) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json(updatedOrder);
  });
});

// @desc delete customer
// route DELETE /api/customers/delete
// @access public
const deleteOrder = asyncHandler(async (req, res) => {
  Order.delete(req.params.id, (err, deletedOrder) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(204).send(deletedOrder.id);
  });
});

export { getOrders, addOrder, updateOrder, deleteOrder };
