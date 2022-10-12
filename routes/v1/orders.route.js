const express = require("express");
const orderController = require("../../controllers/orders.controller");

const router = express.Router();

router.route("/:email").get(orderController.getOrderByEmail);

router
  .route("/")
  .post(orderController.createOrders)
  .get(orderController.getAllOrders);

router.route("/:id").delete(orderController.deleteOrderById);

module.exports = router;
