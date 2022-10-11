const express = require("express");
const orderController = require("../../controllers/orders.controller");

const router = express.Router();

router.route("/").post(orderController.createOrders);

router.route("/:email").get(orderController.getOrderByEmail);

module.exports = router;
