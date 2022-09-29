const mongoose = require("mongoose");

const productsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Name must be required"],
      trim: true,
      unique: [true, "Name must be unique"],
      minLength: [3, "Name must be at least 3 characters"],
      maxLength: [100, "Name is too large"],
    },
    img: {
      type: String,
      require: [true, "Image must be required"],
      trim: true,
      unique: [true, "Image link must be unique"],
    },
    price: {
      type: Number,
      require: [true, "Price must be required"],
      min: [0, "Price can't negative"],
      trim: true,
    },
    details: {
      type: {},
      require: [true, "Details must be required"],
    },
    about: {
      type: [],
      require: [true, "About must be required"],
    },
    ratings: {
      type: Number,
      require: [true, "Ratings must be required"],
    },
    main_key: {
      type: String,
      require: [true, "Main key must be required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Products = new mongoose.model("Products", productsSchema);

module.exports = Products;
