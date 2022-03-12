const express = require("express");
const {param, body, query} = require("express-validator");
const isAuthenticated = require("../../middleware/isAuthenticated");
const isUserLeader = require("../../middleware/isUserLeader");
const checkValidationErrors = require("../../middleware/checkValidationErrors");
const checkModelUserAccess = require("../../middleware/checkModelUserAccess");
const userBelongsToGroup = require("../../middleware/userBelongsToGroup");
const CampusController = require("../../controllers/CampusController");

const router = express.Router();

router.use(isAuthenticated)
router.use(userBelongsToGroup(true))

router.get(
  '/:campusId',
  param('campusId').isInt({min: 1}),
  checkValidationErrors,
  checkModelUserAccess('Campus', 'campusId', {read: true}),
  CampusController.getOne
)

router.patch(
  '/:campusId',
  isUserLeader,
  param('campusId').isInt({min: 1}),
  body('name').isString(),
  body('address').isString(),
  checkValidationErrors,
  checkModelUserAccess('Campus', 'campusId', {write: true}),
  CampusController.update
)

router.delete(
  '/:campusId',
  isUserLeader,
  param('campusId').isInt({min: 1}),
  checkValidationErrors,
  checkModelUserAccess('Campus', 'campusId', {write: true}),
  CampusController.delete
)

module.exports = router