const express = require("express");
const {param, body, query} = require("express-validator");
const handleValidationErrors = require("../../middleware/handleValidationErrors");
const isAuthenticated = require("../../middleware/isAuthenticated");
const isUserLeader = require("../../middleware/isUserLeader");
const checkEntityUserRights = require("../../middleware/checkEntityUserRights");
const userBelongsToGroup = require("../../middleware/userBelongsToGroup");
const EventController = require("../../controllers/EventController");

const router = express.Router();

router.get(
  '/',
  query('limit').isInt({min: 1}).optional(),
  query('offset').isInt({min: 0}).optional(),
  handleValidationErrors,
  isAuthenticated,
  EventController.getAll
)

router.post(
  '/',
  isAuthenticated,
  userBelongsToGroup(true),
  isUserLeader,
  body('name').isString().notEmpty(),
  body('content').isString().optional(),
  body('activeFromDate').isDate().optional(),
  body('activeToDate').isDate().optional(),
  handleValidationErrors,
  EventController.create
)

router.get(
  '/:eventId',
  param('eventId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  checkEntityUserRights('Event', 'eventId', ['r']),
  EventController.getOne
)

router.patch(
  '/:eventId',
  param('eventId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  body('name').isString().notEmpty().optional(),
  body('content').isString().optional(),
  body('activeFromDate').isDate().optional(),
  body('activeToDate').isDate().optional(),
  handleValidationErrors,
  checkEntityUserRights('Event', 'eventId', ['w']),
  EventController.update
)

router.delete(
  '/:eventId',
  param('eventId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  checkEntityUserRights('Event', 'eventId', ['w']),
  EventController.delete
)

module.exports = router
