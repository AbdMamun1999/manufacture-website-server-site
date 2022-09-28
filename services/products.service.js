const Products = require("../models/Product");

exports.getAllProductsService = async(queries)=>{
    const products = await Products.find({})
    return products
}