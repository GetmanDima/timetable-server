const express = require("express");
const {param, body} = require("express-validator");
const checkValidationErrors = require("../../middleware/checkValidationErrors");
const isAuthenticated = require("../../middleware/isAuthenticated");
const checkModelExists = require("../../middleware/checkModelExists");
const isUserLeader = require("../../middleware/isUserLeader");
const userBelongsToGroup = require("../../middleware/userBelongsToGroup");
const EventController = require("../../controllers/EventController");

const router = express.Router();

router.use(isAuthenticated)
router.use(userBelongsToGroup(true))

router.get(
  '/:eventId',
  param('eventId').isInt({min: 1}),
  checkValidationErrors,
  checkModelExists('Event', 'eventId'),
  EventController.getOne
)

router.patch(
  '/:eventId',
  isUserLeader,
  param('eventId').isInt({min: 1}),
  body('name').isString().notEmpty(),
  body('content').isString().notEmpty().optional(),
  body('activeFromDate').isISO8601().optional(),
  body('activeToDate').isISO8601().optional(),
  checkValidationErrors,
  checkModelExists('Event', 'eventId'),
  EventController.update
)

router.delete(
  '/:eventId',
  isUserLeader,
  param('eventId').isInt({min: 1}),
  checkValidationErrors,
  checkModelExists('Event', 'eventId'),
  EventController.delete
)

module.exports = router