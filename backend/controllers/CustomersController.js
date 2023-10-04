import asyncHandler from "express-async-handler";
import Customer from "../models/Customer.js";

// @desc getting all customers
// route GET /api/customers/all
// @access public

const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.getAll();
  if (!customers) {
    res.status(404).json({ error: "Customer not found" });
  }
  res.status(200).json(customers);
});

// @desc add new customer
// route POST /api/customers/add
// @access public

const addCustomer = asyncHandler(async (req, res) => {
  const newCustomer = req.body;
  const addedCustomer = await Customer.insert(newCustomer);
  res.status(201).json(addedCustomer);
});

// @desc update customer
// route PUT /api/customers/update
// @access public
const updateCustomer = asyncHandler(async (req, res) => {
  const customerId = req.body.id;
  const customerToUpdate = req.body;
  const updatedCustomer = await Customer.update(customerId, customerToUpdate);

  res.status(200).json(updatedCustomer);
});

// @desc delete customer
// route DELETE /api/customers/delete
// @access public
const deleteCustomer = asyncHandler(async (req, res) => {
  const customerId = req.params.id;
  const deletedCustomer = await Customer.delete(customerId);
  res.status(204).send(deletedCustomer);
});

const getCustomer = asyncHandler(async (req, res) => {
  const customerId = req.params.id;
  const customer = await Customer.getById(customerId);
  res.status(200).json(customer);
});

export {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomer,
};
