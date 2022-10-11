const Orders = require("../models/Orders");

exports.createAOrderService = async (data) => {
  const result = await Orders.create(data);
  return result;
};

exports.getOrdersByEmailService = async (email) => {
  const orders = await Orders.find({ userEmail: email });
  return orders;
};
