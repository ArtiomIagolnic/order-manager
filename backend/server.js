import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { fileURLToPath } from "url"; // Import the 'fileURLToPath' function
import path from "path";

import eventListeners from "./modules/EventListeners.js";

dotenv.config();

import { notFound } from "./middleware/errorMiddleware.js";

const port = process.env.PORT || 8000;

import customerRoutes from "./routes/customerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import logsRoutes from "./routes/logsRoutes.js";

const __filename = fileURLToPath(import.meta.url); // Get the current module's filename
const __dirname = path.dirname(__filename); // Get the directory name from the filename

const app = express();
app.use(
  cors({
    exposedHeaders: "Content-Disposition", // Add Content-Disposition to the list of exposed headers
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

eventListeners.entityUpdatedListener();
eventListeners.entityCreatedListener();
eventListeners.entityDeletedListener();

// Serve static files from the "client/dist" directory
app.use(express.static(path.join(__dirname, "../client/dist"))); // Go up one level to access the client folder
// Serve static files from the "storage/exports" directory
app.use("/exports", express.static(path.join(__dirname, "storage/exports")));

app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/exports", exportRoutes);
app.use("/api/logs", logsRoutes);

// Redirect all other routes to the Vue.js application
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html")); // Go up one level to access the client folder
});

app.use(notFound);

app.listen(port, () => {
  console.log(`Server started on port : ${port}`);
});
