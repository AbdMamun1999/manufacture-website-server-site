const Products = require("../models/Product");

exports.getAllProductsService = async (queries) => {
  const products = await Products.find({})
    .skip(queries.skip)
    .limit(queries.limit)
    .sort(queries.sort)
    .select(queries.fields);
  return products;
};

exports.saveASingleProductService = async (data) => {
  const result = await Products.create(data);
  return result;
};

exports.getProductByIdService = async (id) => {
  const product = await Products.findById(id)
  return product
};
