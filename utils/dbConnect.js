const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");
dotenv.config();

const dbConnection = () => {
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`
    )
    .then(() => console.log("Database connection is successful".yellow.bold))
    .catch((err) => console.log(err));
};

module.exports = dbConnection;