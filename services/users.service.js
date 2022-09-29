const Users = require("../models/User");

exports.createOrUpdateUsersService = async (queries, update, options) => {
  const result = await Users.findOneAndUpdate(queries, update, options);
  return result;
};
