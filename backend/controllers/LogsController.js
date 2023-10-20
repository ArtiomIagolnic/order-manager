import asyncHandler from "express-async-handler";
import Log from "../models/Log.js";

// @desc getting all customers , also if were sent data for sorting , the sorting is done , according to data
// route GET /api/customers/all
// @access public

const getLogs = asyncHandler(async (req, res) => {
  const logs = await Log.getAll();

  if (!logs) {
    res.status(404).json({ error: "Log not found" });
  }
  res.status(200).json(logs);
});

export { getLogs };
