const { createAReviewService } = require("../services/review.service");

exports.createAReview = async (req, res, next) => {
  try {
    const result = await createAReviewService(req.body);
    res.status(200).send({
      message: "Successfully reviewed",
    });
  } catch (error) {
    res.status(400).send({
      message: "Can not reviewed.Something went wrong",
      error: error.message,
    });
  }
};
