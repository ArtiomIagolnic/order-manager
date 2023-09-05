import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import http from "http";
import { fileURLToPath } from 'url'; // Import the 'fileURLToPath' function
import path from "path";

dotenv.config();

import { notFound } from "./middleware/errorMiddleware.js";

const port = process.env.PORT || 8000;

import customerRoutes from "./routes/customerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const __filename = fileURLToPath(import.meta.url); // Get the current module's filename
const __dirname = path.dirname(__filename); // Get the directory name from the filename

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "client/dist" directory
app.use(express.static(path.join(__dirname, "client", "dist")));

app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Redirect all other routes to the Vue.js application
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use(notFound);

app.listen(port, () => {
  console.log(`Server started on port : ${port}`);
});
