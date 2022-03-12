const express = require("express");
const {param, body} = require("express-validator");
const isAuthenticated = require("../../middleware/isAuthenticated");
const checkValidationErrors = require("../../middleware/checkValidationErrors");
const checkModelUserAccess = require("../../middleware/checkModelUserAccess");
const isUserLeader = require("../../middleware/isUserLeader");
const userBelongsToGroup = require("../../middleware/userBelongsToGroup");
const isStudentInUniversity = require("../../middleware/isStudentInUniversity");
const DirectionController = require("../../controllers/DirectionController");

const router = express.Router();

router.get(
  '/:departmentId/directions',
  isAuthenticated,
  param('departmentId').isInt({min: 1}),
  checkValidationErrors,
  checkModelUserAccess('Department', 'departmentId', {read: true}),
  DirectionController.getAllByDepartmentId
)

router.post(
  '/:departmentId/directions',
  isAuthenticated,
  isUserLeader,
  userBelongsToGroup(false),
  param('departmentId').isInt({min: 1}),
  body('name').isString().notEmpty(),
  body('fullName').isString().notEmpty().optional(),
  checkValidationErrors,
  checkModelUserAccess('Department', 'departmentId', {read: true}),
  isStudentInUniversity,
  DirectionController.create
)

module.exports = router