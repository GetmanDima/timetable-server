const express = require("express");
const {param, body} = require("express-validator");
const checkValidationErrors = require("../../middleware/checkValidationErrors");
const isAuthenticated = require("../../middleware/isAuthenticated");
const checkModelExists = require("../../middleware/checkModelExists");
const isUserLeader = require("../../middleware/isUserLeader");
const userBelongsToGroup = require("../../middleware/userBelongsToGroup");
const TimetableDayController = require("../../controllers/TimetableDayController");
const TimetableController = require("../../controllers/TimetableController");

const router = express.Router();

router.use(isAuthenticated)
router.use(userBelongsToGroup(true))

router.get(
  '/:timetableId',
  param('timetableId').isInt({min: 1}),
  checkValidationErrors,
  checkModelExists('Timetable', 'timetableId'),
  TimetableController.getOne
)

router.patch(
  '/:timetableId',
  isUserLeader,
  body('name').isString().notEmpty(),
  checkValidationErrors,
  checkModelExists('Timetable', 'timetableId'),
  TimetableController.update
)

router.delete(
  '/:timetableId',
  isUserLeader,
  body('name').isString().notEmpty(),
  checkValidationErrors,
  checkModelExists('Timetable', 'timetableId'),
  TimetableController.delete
)

router.get(
  '/:timetableId/days',
  param('timetableId').isInt({min: 1}),
  checkValidationErrors,
  checkModelExists('Timetable', 'timetableId'),
  TimetableDayController.getAllByTimetableId
)

router.post(
  '/:timetableId/days',
  isUserLeader,
  param('timetableId').isInt({min: 1}),
  body('weekDay').notEmpty(),
  checkValidationErrors,
  checkModelExists('Timetable', 'timetableId'),
  TimetableDayController.create
)

module.exports = router