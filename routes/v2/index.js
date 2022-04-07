const express = require('express')
const authRouter = require("../authRouter");
const tokenRouter = require("./tokenRouter");

const router = express.Router();

router.use('/auth', authRouter(false))
router.use('/tokens', tokenRouter)

module.exports = router