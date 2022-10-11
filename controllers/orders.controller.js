const validator = require("validator");
const {
  createAOrderService,
  getOrdersByEmailService,
} = require("../services/orders.service");

exports.createOrders = async (req, res, next) => {
  try {
    const orders = await createAOrderService(req.body);

    res.status(200).send({
      message: "Successfully Ordered",
    });
  } catch (error) {
    res.status(400).send({
      message: "Can not Ordered.Something went wrong",
    });
  }
};

exports.getOrderByEmail = async (req, res, next) => {
  try {
  if (!validator.isEmail(req.params.email)) {
    res.status(400).send({
      status: false,
      message: "Provide a valid email",
    });
  }

  const orders = await getOrdersByEmailService(req?.params?.email);

  res.status(200).send({
    message: "Successfully Get the Data",
    data: orders,
  });
   } catch (error) {
    res.status(400).send({
      false: false,
      message: "Can't get the data",
      error: error.message,
    });
  }
};
