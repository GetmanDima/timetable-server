const express = require("express");
const {param, body} = require("express-validator");
const checkValidationErrors = require("../../middleware/checkValidationErrors");
const isAuthenticated = require("../../middleware/isAuthenticated");
const checkModelExists = require("../../middleware/checkModelExists");
const isUserLeader = require("../../middleware/isUserLeader");
const userBelongsToGroup = require("../../middleware/userBelongsToGroup");
const TimetableDayController = require("../../controllers/TimetableDayController");

const router = express.Router();

router.use(isAuthenticated)
router.use(userBelongsToGroup(true))

router.get(
  '/:timetableDayId',
  param('timetableDayId').isInt({min: 1}),
  checkValidationErrors,
  checkModelExists('TimetableDay', 'timetableDayId'),
  TimetableDayController.getOne
)

router.patch(
  '/:timetableDayId',
  isUserLeader,
  param('timetableDayId').isInt({min: 1}),
  checkValidationErrors,
  checkModelExists('TimetableDay', 'timetableDayId'),
  TimetableDayController.update
)

router.delete(
  '/:timetableDayId',
  isUserLeader,
  param('timetableDayId').isInt({min: 1}),
  checkValidationErrors,
  checkModelExists('TimetableDay', 'timetableDayId'),
  TimetableDayController.delete
)

module.exports = router