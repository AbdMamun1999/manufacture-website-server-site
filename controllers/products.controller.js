const ObjectId = require("mongoose").Types.ObjectId;
const {
  getAllProductsService,
  saveASingleProductService,
  getProductByIdService,
} = require("../services/products.service");

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

exports.saveASingleProduct = async (req, res, next) => {
  try {
    const result = await saveASingleProductService(req.body);
    await result.save();

    res.status(201).send({
      status: true,
      message: "Product save successfull",
      data: result,
    });
  } catch (error) {
    res.status(403).send({
      status: false,
      message: "Product can not save.Something went wrong",
      error: error.message,
    });
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).send({
        status: false,
        error: `${id} is not valid`,
      });
    }

    const product =await getProductByIdService(id);

    res.status(200).json({
      status: true,
      message: "Successfully get the products",
      data: product,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: "Can not get the product.Something went wrong!",
      error: error.message,
    });
  }
};
