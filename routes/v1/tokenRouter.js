const express = require("express")
const {body} = require("express-validator");
const TokenController = require("../../controllers/TokenController");

const router = express.Router();

router.post(
  '/',
  body('refreshToken').notEmpty(),
  TokenController.update(true)
)

module.exports = router