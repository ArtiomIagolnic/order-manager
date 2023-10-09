import asyncHandler from "express-async-handler";
import Customer from "../models/Customer.js";
import Export from "../models/Export.js";
import ExcelExporter from "../modules/ExcelExporter.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import timeStampFormat from "../utils/timeStampUtility.js";

// @desc getting all customers , also if were sent data for sorting , the sorting is done , according to data
// route GET /api/customers/all
// @access public

const getCustomers = asyncHandler(async (req, res) => {
  const { sortHeader, sortOrder } = req.query;
  const customers = await Customer.getAll();
  if (sortHeader && sortOrder) {
    const getColumnValue = (customer, column) => {
      switch (column) {
        case "firstName":
          return customer.firstName;
        case "lastName":
          return customer.lastName;
        case "age":
          return customer.age;
        case "billingAdress":
          return customer.billingAdress;
        default:
          return "";
      }
    };

    customers.sort((a, b) =>
      sortOrder === "asc"
        ? getColumnValue(a, sortHeader).localeCompare(
            getColumnValue(b, sortHeader)
          )
        : getColumnValue(b, sortHeader).localeCompare(
            getColumnValue(a, sortHeader)
          )
    );
  }

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
  const customerIds = req.params.customers.split(",");
  const deletedCustomer = await Customer.delete(customerIds);
  res.status(204).send(deletedCustomer);
});

const getCustomer = asyncHandler(async (req, res) => {
  const customerId = req.params.id;
  const customer = await Customer.getById(customerId);
  res.status(200).json(customer);
});

const exportCustomer = asyncHandler(async (req, res) => {
  try {
    const customerIds = req.params.customers.split(",");

    const customers = await Customer.getById(customerIds);
    if (!customers) {
      res.status(404).json({ error: "One or more customers not found" });
      return;
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const exportDirectory = path.resolve(__dirname, "../storage/exports/");
    const excelExportFilename = `customers_${Date.now()}.xlsx`;
    const excelExportPath = path.join(exportDirectory, excelExportFilename);

    // set the columns width
    const columnWidths = {
      firstName: 20,
      lastName: 20,
      age: 10,
      shippingAdress: 30,
      billingAdress: 30,
      id: 40,
      fullName: 30,
    };

    // create a file in /storage/exports/filename
    await ExcelExporter.exportDataToExcel(
      customers,
      excelExportPath,
      columnWidths
    );

    // create a new record in /storage/database/exports.json

    const exportRecord = {
      id: uuidv4(),
      timestamp: timeStampFormat(new Date()),
      sourceTable: "customers",
      exportedFile: excelExportFilename,
    };
    await Export.insert(exportRecord);

    //send file for downloading
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${excelExportFilename}`
    );

    const fileStream = fs.createReadStream(excelExportPath);

    fileStream.pipe(res);
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ success: false, error: "Export error" });
  }
});

export {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomer,
  exportCustomer,
};
