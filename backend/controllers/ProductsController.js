import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Export from "../models/Export.js";
import ExcelExporter from "../modules/ExcelExporter.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import timeStampFormat from "../utils/timeStampUtility.js";

// @desc getting all products and sorting them according to came data
// route GET /api/products/all
// @access public

const getProducts = asyncHandler(async (req, res) => {
  const { sortHeader, sortOrder } = req.query;
  const products = await Product.getAll();

  if (sortHeader && sortOrder) {
    const getColumnValue = (product, column) => {
      switch (column) {
        case "name":
        case "price":
        case "stock":
        case "sku":
          return product[column];
        default:
          return "";
      }
    };
    products.sort((a, b) => {
      const valueA = getColumnValue(a, sortHeader);
      const valueB = getColumnValue(b, sortHeader);

      if (sortOrder === "asc") {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueB < valueA ? -1 : valueB > valueA ? 1 : 0;
      }
    });
  }
  if (!products) {
    res.status(404).json({ error: "Product not found" });
  }
  res.status(200).json(products);
});

// @desc add new product
// route POST /api/products/add
// @access public

const addProduct = asyncHandler(async (req, res) => {
  const productToAdd = req.body;
  const newProduct = await Product.insert(productToAdd);
  res.status(201).json(newProduct);
});

// @desc update product
// route PUT /api/products/update
// @access public
const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.body.id;
  const productToUpdate = req.body;
  const updatedProduct = await Product.update(productId, productToUpdate);
  res.status(200).json(updatedProduct);
});

// @desc delete product
// route DELETE /api/products/delete
// @access public
const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.products.split(",");
  console.log(productId);
  const deletedProduct = await Product.delete(productId);
  res.status(204).send(deletedProduct);
});

// @desc exporting all or one product as an excel file
// route GET /api/products/export/:id
// @access public
const exportProduct = asyncHandler(async (req, res) => {
  try {
    const productIds = req.params.products.split(",");

    const products = await Product.getById(productIds);
    if (!products) {
      res.status(404).json({ error: "One or more products not found" });
      return;
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const exportDirectory = path.resolve(__dirname, "../storage/exports/");
    const excelExportFilename = `products_${Date.now()}.xlsx`;
    const excelExportPath = path.join(exportDirectory, excelExportFilename);

    // set the columns width
    const columnWidths = {
      name: 20,
      price: 20,
      stock: 10,
      sku: 20,
      id: 40,
    };

    // create a file in /storage/exports/filename
    await ExcelExporter.exportDataToExcel(
      products,
      excelExportPath,
      columnWidths
    );

    // create a new record in /storage/database/exports.json
    const baseUrl = "http://localhost:8000/exports/";
    //create a link to download export file
    const fileUrl = `${baseUrl}${excelExportFilename}`;

    // create a new record in /storage/database/exports.json
    const exportRecord = {
      id: uuidv4(),
      timestamp: timeStampFormat(new Date()),
      sourceTable: "products",
      exportedFile: excelExportFilename,
      exportedFileUrl: fileUrl,
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

export { getProducts, addProduct, updateProduct, deleteProduct, exportProduct };
