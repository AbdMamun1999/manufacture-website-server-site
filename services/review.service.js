const Review = require("../models/Reviews");

exports.createAReviewService = async (data) => {
  const result = await Review.create(data);
  return result;
};

exports.getAllReviewsService = async () => {
  const reviews = await Review.find({});
  return reviews;
};
