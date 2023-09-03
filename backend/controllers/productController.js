// @desc getting all products
// route GET /api/products/all
// @access public

const getAll = (req, res) => {
    res.status(200).json({ message: "Get all products" });
  };
  
  export { getAll };
  