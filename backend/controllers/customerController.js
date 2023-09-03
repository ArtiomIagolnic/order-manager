import asyncHandler from "express-async-handler";
const dataPath = "./details/customers.json";
import fs from "fs";

// @desc getting all customers
// route GET /api/customers/all
// @access public

const getAll = asyncHandler(async (req, res) => {
  const jsonData = fs.readFileSync(dataPath);
  const customers = JSON.parse(jsonData);
  
  res.status(200).json(customers);
});

// @desc add new customer
// route POST /api/customers/add
// @access public

const addCustomer = asyncHandler(async (req, res) => {
  const newCustomer = req.body;
  const jsonData = fs.readFileSync(dataPath);
  const customers = JSON.parse(jsonData);
  if (newCustomer) {
    customers.push(newCustomer);
    fs.writeFileSync(dataPath, JSON.stringify(customers, null, 2));
    res
      .status(201)
      .json({ message: "Customer added successfully", newCustomer });
  } else {
    res.status(404);
    throw new Error("Something went wrong");
  }
});

// @desc update customer
// route PUT /api/customers/update
// @access public
const updateCustomer = asyncHandler(async (req, res) => {
  const updatedCustomer = req.body;
  const customerId = updatedCustomer.id;

  const jsonData = fs.readFileSync(dataPath);
  const customers = JSON.parse(jsonData);

  const customerIndex = await customers.findIndex(
    (customer) => customer.id === customerId
  );
  if (customerIndex === -1) {
    res.status(404);
    throw new Error("User not found");
  } else {
    customers[customerIndex] = updatedCustomer;
    fs.writeFileSync(dataPath, JSON.stringify(customers, null, 2));

    res
      .status(200)
      .json({ message: "Customer updated successfully", updatedCustomer });
  }
});

// @desc delete customer
// route DELETE /api/customers/delete
// @access public
const deleteCustomer = asyncHandler(async (req, res) => {
  const customerId = req.params.id;

  const jsonData = fs.readFileSync(dataPath);
  const customers = JSON.parse(jsonData);

  const customerIndex = await customers.findIndex(
    (customer) => customer.id === customerId
  );
  if (customerIndex !== -1) {
    customers.splice(customerIndex, 1);

    fs.writeFileSync(dataPath, JSON.stringify(customers, null, 2));

    res.status(200).json({ message: "Customer deleted successfully" });
  } else {
    res.status(404);
    throw new Error("Customer not found");
  }
});

export { getAll, addCustomer, updateCustomer, deleteCustomer };
