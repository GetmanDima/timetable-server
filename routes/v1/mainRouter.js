const express = require('express')
const userProfileRouter = require("./userProfileRouter");
const authRouter = require("../authRouter");
const tokenRouter = require("./tokenRouter");
const universityRouter = require("./universityRouter");
const facultyRouter = require("./facultyRouter");
const departmentRouter = require("./departmentRouter");
const directionRouter = require("./directionRouter");
const groupRouter = require("./groupRouter");
const subjectRouter = require("./subjectRouter");
const timetableRouter = require("./timetableRouter");
const eventRouter = require("./eventRouter");
const materialRouter = require("./materialRouter");
const classTimeRouter = require("./classTimeRouter");
const timetableDayRouter = require("./timetableDayRouter");
const campusRouter = require("./campusRouter");
const teacherRouter = require("./teacherRouter");
const groupInviteRouter = require("./groupInviteRouter");

const router = express.Router();

router.use('/auth', authRouter(true))
router.use('/tokens', tokenRouter)
router.use('/profile', userProfileRouter)
router.use('/universities', universityRouter)
router.use('/faculties', facultyRouter)
router.use('/departments', departmentRouter)
router.use('/directions', directionRouter)
router.use('/groups', groupRouter)
router.use('/subjects', subjectRouter)
router.use('/timetables', timetableRouter)
router.use('/events', eventRouter)
router.use('/materials', materialRouter)
router.use('/class-times', classTimeRouter)
router.use('/timetable-days', timetableDayRouter)
router.use('/campuses', campusRouter)
router.use('/teachers', teacherRouter)
router.use('/group-invites', groupInviteRouter)

module.exports = router