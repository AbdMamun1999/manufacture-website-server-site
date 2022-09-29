const express = require("express");
const productsControllers = require("../../controllers/products.controller");
const router = express.Router();

router
  .route("/")
  .get(productsControllers.getAllProducts)
  .post(productsControllers.saveASingleProduct);

router.route("/:id").get(productsControllers.getProductById);

module.exports = router;
