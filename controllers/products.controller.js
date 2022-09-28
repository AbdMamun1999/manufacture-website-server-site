const { getAllProductsService } = require("../services/products.service");

exports.getAllProducts = async (req, res, next) => {
  try {
    const queries = {};

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queries.sortBy = sortBy;
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queries.fields = fields;
    }

    if (req.query.page) {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * Number(limit);
      queries.skip = skip;
      queries.limit = Number(limit);
    }

    const products = await getAllProductsService(queries);

    res.status(200).json({
      status: true,
      message: "Successfully get All Data",
      data: products,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: "Data can't get.Something went wrong",
      error: error.message,
    });
  }
};
