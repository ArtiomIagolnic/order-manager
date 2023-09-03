// @desc getting all orders
// route GET /api/orders/all
// @access public

const getAll = (req, res) => {
    res.status(200).json({ message: "Get all orders" });
  };
  
  export { getAll };
  