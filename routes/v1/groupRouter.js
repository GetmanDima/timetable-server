const express = require("express");
const {param, body, query} = require("express-validator");
const checkValidationErrors = require("../../middleware/checkValidationErrors");
const isAuthenticated = require("../../middleware/isAuthenticated");
const isStudentInGroup = require("../../middleware/isStudentInGroup");
const checkModelExists = require("../../middleware/checkModelExists");
const isUserLeader = require("../../middleware/isUserLeader");
const userBelongsToGroup = require("../../middleware/userBelongsToGroup");
const GroupController = require("../../controllers/UniversityStructure/GroupController");
const ClassTimeController = require("../../controllers/ClassTimeController");
const TimetableController = require("../../controllers/TimetableController");
const EventController = require("../../controllers/EventController");
const MaterialController = require("../../controllers/MaterialController");
const GroupInviteController = require("../../controllers/GroupInviteController");

const router = express.Router();

router.use(isAuthenticated)
router.use(userBelongsToGroup(true))

router.get(
  '/:groupId',
  param('groupId').isInt({min: 1}),
  checkValidationErrors,
  checkModelExists('Group', 'groupId'),
  isStudentInGroup,
  GroupController.getOne
)

router.patch(
  '/:groupId',
  isUserLeader,
  param('groupId').isInt({min: 1}),
  body('name').isString().notEmpty().optional(),
  body('courseNumber').isInt({min: 1, max: 20}).optional(),
  body('admissionYear').isInt({min: 2000, max: new Date().getFullYear()}).optional(),
  checkValidationErrors,
  checkModelExists('Group', 'groupId'),
  isStudentInGroup,
  GroupController.update
)

router.get(
  '/:groupId/class-times',
  param('groupId').isInt({min: 1}),
  checkValidationErrors,
  checkModelExists('Group', 'groupId'),
  isStudentInGroup,
  ClassTimeController.getAllByGroupId
)

router.post(
  '/:groupId/class-times',
  isUserLeader,
  param('groupId').isInt({min: 1}),
  body('number').isInt({min: 1}),
  body('startTime').notEmpty().matches('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$'),
  body('endTime').notEmpty().matches('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$'),
  checkValidationErrors,
  body('endTime').custom((endTime, {req}) => {
    const [endTimeHours, endTimeMinutes, endTimeSeconds] = endTime.split(':').map(_ => parseInt(_))
    const [startTimeHours, startTimeMinutes, startTimeSeconds] = req.body['startTime'].split(':').map(_ => parseInt(_))

    const endTimeDate = new Date()
    endTimeDate.setHours(endTimeHours, endTimeMinutes, endTimeSeconds)

    const startTimeDate = new Date()
    startTimeDate.setHours(startTimeHours, startTimeMinutes, startTimeSeconds)

    if (startTimeDate >= endTimeDate) {
      return Promise.reject("Start time >= End Time")
    }

    return true
  }),
  checkValidationErrors,
  checkModelExists('Group', 'groupId'),
  isStudentInGroup,
  ClassTimeController.create
)

router.get(
  '/:groupId/timetables',
  param('groupId').isInt({min: 1}),
  checkValidationErrors,
  checkModelExists('Group', 'groupId'),
  isStudentInGroup,
  TimetableController.getAllByGroupId
)

router.post(
  '/:groupId/timetables',
  isUserLeader,
  param('groupId').isInt({min: 1}),
  body('name').isString().notEmpty(),
  checkValidationErrors,
  checkModelExists('Group', 'groupId'),
  isStudentInGroup,
  TimetableController.create
)

router.get(
  '/:groupId/events',
  param('groupId').isInt({min: 1}),
  query('limit').isInt({min: 1}).optional(),
  query('offset').isInt({min: 0}).optional(),
  query('activeFromDate').isISO8601().optional(),
  query('activeToDate').isISO8601().optional(),
  checkValidationErrors,
  checkModelExists('Group', 'groupId'),
  isStudentInGroup,
  EventController.getAllByGroupId
)

router.post(
  '/:groupId/events',
  isUserLeader,
  param('groupId').isInt({min: 1}),
  body('name').isString().notEmpty(),
  body('content').isString().notEmpty().optional(),
  body('activeFromDate').isISO8601().optional(),
  body('activeToDate').isISO8601().optional(),
  checkValidationErrors,
  checkModelExists('Group', 'groupId'),
  isStudentInGroup,
  EventController.create
)

router.get(
  '/:groupId/materials',
  param('groupId').isInt({min: 1}),
  query('limit').isInt({min: 1}).optional(),
  query('offset').isInt({min: 0}).optional(),
  checkValidationErrors,
  checkModelExists('Group', 'groupId'),
  isStudentInGroup,
  MaterialController.getAll
)

router.get(
  '/:groupId/invites',
  param('groupId').isInt({min: 1}),
  checkValidationErrors,
  checkModelExists('Group', 'groupId'),
  isStudentInGroup,
  GroupInviteController.getAllByGroupId
)

router.post(
  '/:groupId/invites',
  isUserLeader,
  param('groupId').isInt({min: 1}),
  body('code').isString().notEmpty(),
  checkValidationErrors,
  checkModelExists('Group', 'groupId'),
  isStudentInGroup,
  GroupInviteController.create
)


module.exports = router
