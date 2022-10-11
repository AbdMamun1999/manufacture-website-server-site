const mongoose = require("mongoose");
const validator = require("validator");

const orderSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      require: [true, "Product id is required"],
    },
    productName: {
      type: String,
      require: [true, "Product name is required"],
    },
    imgUrl: {
      type: String,
      require: [true, "Image url is required"],
      validate: [validator.isURL, "Provide a valid url"],
    },
    userEmail: {
      type: String,
      require: [true, "Email is required"],
      lowercase: true,
      validate: [validator.isEmail, "Provide an valid email"],
    },
    address: {
      type: String,
      require: [true, "Address is required"],
    },
    phone: {
      type: String,
      require: [true, "Number is required"],
    },
    purchaseQuantity: {
      type: Number,
      require: [true, "Purchase quantity is required"],
    },
    purchasePrice: {
      type: Number,
      require: [true, "Purchase price is required"],
    },
    paid: {
      type: Boolean,
    },
    status: {
      type: Boolean,
    },
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Orders = new mongoose.model("Orders", orderSchema);

module.exports = Orders;
