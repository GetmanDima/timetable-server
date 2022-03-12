const express = require("express");
const {param, body} = require("express-validator");
const isAuthenticated = require("../../middleware/isAuthenticated");
const checkValidationErrors = require("../../middleware/checkValidationErrors");
const checkModelUserAccess = require("../../middleware/checkModelUserAccess");
const isUserLeader = require("../../middleware/isUserLeader");
const userBelongsToGroup = require("../../middleware/userBelongsToGroup");
const isStudentInUniversity = require("../../middleware/isStudentInUniversity");
const GroupController = require("../../controllers/GroupController");

const router = express.Router();

router.post(
  '/:directionId/groups',
  isAuthenticated,
  isUserLeader,
  userBelongsToGroup(false),
  param('directionId').isInt({min: 1}),
  body('name').isString().notEmpty(),
  body('courseNumber').isInt({min: 1, max: 20}).optional(),
  body('admissionYear').isInt({min: 2000, max: new Date().getFullYear()}).optional(),
  checkValidationErrors,
  checkModelUserAccess('Direction', 'directionId', {read: true}),
  isStudentInUniversity,
  GroupController.create
)

module.exports = router