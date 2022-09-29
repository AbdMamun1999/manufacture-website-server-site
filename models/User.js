const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema(
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
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    education: {
      type: String,
      trim: true,
    },
    educationIns: {
      type: String,
      trim: true,
    },
    facebookUrl: {
      type: String,
      trim: true,
    },
    phone: { type: Number },
    role: { type: String },
  },
  { timestamps: true }
);

const Users = new mongoose.model("Users", userSchema);

module.exports = Users;
