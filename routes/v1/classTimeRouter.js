const express = require("express");
const {param, body} = require("express-validator");
const isAuthenticated = require("../../middleware/isAuthenticated");
const isUserLeader = require("../../middleware/isUserLeader");
const checkValidationErrors = require("../../middleware/checkValidationErrors");
const checkModelExists = require("../../middleware/checkModelExists");
const userBelongsToGroup = require("../../middleware/userBelongsToGroup");
const ClassTimeController = require("../../controllers/ClassTimeController");

const router = express.Router();

router.use(isAuthenticated)
router.use(userBelongsToGroup(true))

router.get(
  '/:classTimeId',
  param('classTimeId').isInt({min: 1}),
  checkValidationErrors,
  checkModelExists('ClassTime', 'classTimeId'),
  ClassTimeController.getOne
)

router.patch(
  '/:classTimeId',
  isUserLeader,
  param('classTimeId').isInt({min: 1}),
  body('number').isInt({min: 1}),
  body('startTime').notEmpty().matches('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$'),
  body('endTime').notEmpty().matches('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$'),
  checkValidationErrors,
  checkModelExists('ClassTime', 'classTimeId'),
  ClassTimeController.update
)

router.delete(
  '/:classTimeId',
  isUserLeader,
  param('classTimeId').isInt({min: 1}),
  checkValidationErrors,
  checkModelExists('ClassTime', 'classTimeId'),
  ClassTimeController.delete
)

module.exports = router