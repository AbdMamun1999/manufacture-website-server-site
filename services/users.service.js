const Users = require("../models/User");

exports.createOrUpdateUsersService = async (queries, update, options) => {
  const result = await Users.findOneAndUpdate(queries, update, options);
  return result;
};

exports.getUsersByEmailService = async (email) => {
  const result = await Users.find({ email: email });
  return result;
};
