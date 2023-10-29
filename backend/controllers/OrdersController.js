import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Export from "../models/Export.js";
import ExcelExporter from "../modules/ExcelExporter.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import timeStampFormat from "../utils/timeStampUtility.js";

// @desc getting all customers and sorting them according to came data
// route GET /api/customers/all
// @access public

const getOrders = asyncHandler(async (req, res) => {
  const { sortHeader, sortOrder } = req.query;
  const orders = await Order.getAll();

  if (sortHeader && sortOrder) {
    const getColumnValue = (order, column) => {
      if (column === "customer") {
        // Extract the customer name from the order object
        return order.customer.name;
      }
      switch (column) {
        case "displayedId":
        case "date":
        case "totalAmount":
          return order[column];
        default:
          return "";
      }
    };
    orders.sort((a, b) => {
      const valueA = getColumnValue(a, sortHeader);
      const valueB = getColumnValue(b, sortHeader);

      if (sortOrder === "asc") {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueB < valueA ? -1 : valueB > valueA ? 1 : 0;
      }
    });
  }
  if (!orders) {
    res.status(404).json({ error: "order not found" });
  }
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
  const orderId = req.params.orders.split(",");
  const deletedOrder = await Order.delete(orderId);
  res.status(204).send(deletedOrder.id);
});

const exportOrder = asyncHandler(async (req, res) => {
  try {
    const orderIds = req.params.orders.split(",");

    const orders = await Order.getById(orderIds);
    if (!orders) {
      res.status(404).json({ error: "One or more orders not found" });
      return;
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const exportDirectory = path.resolve(__dirname, "../storage/exports/");
    const excelExportFilename = `orders_${Date.now()}.xlsx`;
    const excelExportPath = path.join(exportDirectory, excelExportFilename);

    //
    const customFormatFunction = (order, row, headers) => {
      if (headers.includes("products")) {
        // Format the "products" column
        let formattedProducts = "";
        for (const product of order.products) {
          formattedProducts += `${product.name} (Price: ${product.price}, Quantity: ${product.quantity}, Total Price: ${product.totalPrice})\n`;
        }
        row[headers.indexOf("products")] = formattedProducts.trim();
      }
      if (headers.includes("customer")) {
        row[headers.indexOf("customer")] =
          `Name: ${order.customer.name}\nId: ${order.customer.id}`.trim();
      }
    };
    // set the columns width
    const columnWidths = {
      customer: 40,
      date: 20,
      products: 55,
      totalAmount: 20,
      displayedId: 20,
      id: 40,
    };

    // create a file in /storage/exports/filename
    await ExcelExporter.exportDataToExcel(
      orders,
      excelExportPath,
      columnWidths,
      customFormatFunction
    );

    // create a new record in /storage/database/exports.json
    const exportRecord = {
      id: uuidv4(),
      timestamp: timeStampFormat(new Date()),
      sourceTable: "orders",
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
export { getOrders, addOrder, updateOrder, deleteOrder, exportOrder };
