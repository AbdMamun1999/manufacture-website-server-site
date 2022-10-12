const mongoose = require("mongoose");
const validator = require("validator");
const { ObjectId } = mongoose.Schema.Types;

const reviesSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Name is required"],
      trim: true,
      minLength: [3, "Name is too short"],
      maxLength: [30, "Name is too large"],
    },
    email: {
      type: String,
      require: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    imgUrl: {
      type: String,
      validator: [validator.isURL, "wrong url"],
    },
    comment: {
      type: String,
      trim: true,
    },
    reviewNumber: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Review = new mongoose.model("Review", reviesSchema);

module.exports = Review;
