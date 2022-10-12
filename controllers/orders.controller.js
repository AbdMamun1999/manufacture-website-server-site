const validator = require("validator");
const {
  createAOrderService,
  getOrdersByEmailService,
  getAllOrdersService,
  deleteOrderService,
} = require("../services/orders.service");

const ObjectId = require("mongoose").Types.ObjectId;

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
    // check email id valid or invalid
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

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await getAllOrdersService();
    res.status(200).send({
      data: orders,
    });
  } catch (error) {
    res.status(400).send({
      message: "Could not get data",
    });
  }
};

exports.deleteOrderById = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).send({
        status: false,
        message: "Object Id is not valid",
      });
    }

    const result = await deleteOrderService(req.params.id);

    res.status(200).send({
      status: true,
      message: "Data is deleted fuccessfully",
      resutl: result,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: "Data is not deleted.Something went wrong",
      error: error.message,
    });
  }
};
