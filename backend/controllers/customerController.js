import asyncHandler from "express-async-handler";

// @desc getting all customers
// route GET /api/customers/all
// @access public

const getAll = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Get all customers" });
});

export { getAll };
