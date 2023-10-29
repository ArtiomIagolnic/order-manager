import asyncHandler from "express-async-handler";
import Log from "../models/Log.js";

// @desc getting all customers , also if were sent data for sorting , the sorting is done , according to data
// route GET /api/customers/all
// @access public

const getLogs = asyncHandler(async (req, res) => {
  const { sortHeader, sortOrder } = req.query;
  const logs = await Log.getAll();
  if (sortHeader && sortOrder) {
    const getColumnValue = (log, column) => {
      switch (column) {
        case "timestamp":
          return log[column];
        default:
          return "";
      }
    };

    logs.sort((a, b) => {
      const valueA = getColumnValue(a, sortHeader);
      const valueB = getColumnValue(b, sortHeader);

      if (sortOrder === "asc") {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueB < valueA ? -1 : valueB > valueA ? 1 : 0;
      }
    });
  }

  if (!logs) {
    res.status(404).json({ error: "Log not found" });
  }
  res.status(200).json(logs);
});

export { getLogs };
