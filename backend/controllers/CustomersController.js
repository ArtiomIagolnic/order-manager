import asyncHandler from "express-async-handler";
import Customer from "../models/Customer.js";

// @desc getting all customers
// route GET /api/customers/all
// @access public

const getCustomers = asyncHandler(async (req, res) => {
  Customer.getAll((err, customers) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json(customers);
  });
});

// @desc add new customer
// route POST /api/customers/add
// @access public

const addCustomer = asyncHandler(async (req, res) => {
  Customer.insert(req.body, (err, newCustomer) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.status(201).json(newCustomer);
  });
});

// @desc update customer
// route PUT /api/customers/update
// @access public
const updateCustomer = asyncHandler(async (req, res) => {
  Customer.update(req.body.id, req.body, (err, updatedCustomer) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json(updatedCustomer);
  });
});

// @desc delete customer
// route DELETE /api/customers/delete
// @access public
const deleteCustomer = asyncHandler(async (req, res) => {
  Customer.delete(req.params.id, (err, deletedCustomer) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (!deletedCustomer) {
        // The record was not found
        res.status(404).json({ error: "Customer not found" });
      } else {
        // Deletion successful, respond with a 204 No Content status
        res.status(204).send(deletedCustomer);
      }
    }
  });
});

const getCustomer = asyncHandler(async (req, res) => {
  Customer.getById(req.params.id, (err, customer) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    res.status(200).json(customer);
  });
});

export {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomer,
};
