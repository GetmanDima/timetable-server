const express = require('express')
const authRouter = require("../authRouter");
const tokenRouter = require("./tokenRouter");
const userRouter = require("./userRouter");
const universityRouter = require("./universityRouter");
const groupRouter = require("./groupRouter");
const timetableRouter = require("./timetableRouter");
const eventRouter = require("./eventRouter");
const materialRouter = require("./materialRouter");
const fileRouter = require("./fileRouter");
const groupInviteRouter = require("./groupInviteRouter");

const router = express.Router();

router.use('/auth', authRouter(true))
router.use('/tokens', tokenRouter)
router.use('/users', userRouter)
router.use('/universities', universityRouter)
router.use('/groups', groupRouter)
router.use('/timetables', timetableRouter)
router.use('/events', eventRouter)
router.use('/materials', materialRouter)
router.use('/files', fileRouter)
router.use('/group-invites', groupInviteRouter)

module.exports = router
