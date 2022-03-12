const express = require("express");
const TokenController = require("../../controllers/TokenController");
const {cookie} = require("express-validator");

const router = express.Router();

router.post(
  '/',
  cookie('refreshToken').notEmpty(),
  TokenController.update(false)
)

module.exports = router