const express = require('express')
const v1Router = require("./v1/mainRouter");
const v2Router = require("./v2/mainRouter");

const router = express.Router();

router.use('/v1', v1Router)
router.use('/v2', v2Router)

module.exports = router