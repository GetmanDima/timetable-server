const express = require("express")
const {body} = require("express-validator");
const TokenController = require("../../controllers/TokenController");
const handleValidationErrors = require("../../middleware/handleValidationErrors");

const router = express.Router();

router.post(
  '/',
  body('refreshToken').isString().notEmpty(),
  handleValidationErrors,
  TokenController.update(true)
)

module.exports = router
