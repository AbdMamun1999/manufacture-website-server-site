const {
  createOrUpdateUsersService,
  getUsersByEmailService,
} = require("../services/users.service");
const jwt = require("jsonwebtoken");

const ObjectId = require("mongoose").Types.ObjectId;

exports.createOrUpdateUsers = async (req, res, next) => {
  try {
    const queries = {};
    let options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const update = {
      name: "Mamun",
    };
    if (req.params.email) {
      queries.email = req.params.email;
    }

    const result = await createOrUpdateUsersService(queries, update, options);

    const token = jwt.sign(
      { email: req.params.email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).send({
      status: false,
      message: "Successfully create or update",
      token: token,
    });
  } catch (error) {
    res.status(404).send({
      status: false,
      message: "Failed to create or update",
      error: error.message,
    });
  }
};

exports.getUsersByEmail = async (req, res, next) => {
  try {
    const user = await getUsersByEmailService(req.params.email);
    res.status(200).send({
      status: true,
      message: "Successfully Get User",
      data: user,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: "Cant not get user.Something went wrong",
      error: error.message,
    });
  }
};
