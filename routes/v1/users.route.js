const express = require("express");
const usersController = require("../../controllers/users.controller");
const router = express.Router();

router
  .route("/:email")
  .put(usersController.createOrUpdateUsers)
  .get(usersController.getUsersByEmail);

module.exports = router;
