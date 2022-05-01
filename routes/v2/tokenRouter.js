const express = require("express");
const TokenController = require("../../controllers/TokenController");
const {cookie} = require("express-validator");
const handleValidationErrors = require("../../middleware/handleValidationErrors");

const router = express.Router();

router.post(
  '/',
  cookie('refreshToken').isString().notEmpty(),
  handleValidationErrors,
  TokenController.update(false)
)

module.exports = router
