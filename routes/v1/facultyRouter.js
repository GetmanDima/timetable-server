const express = require("express");
const {param, body} = require("express-validator");
const isAuthenticated = require("../../middleware/isAuthenticated");
const checkValidationErrors = require("../../middleware/checkValidationErrors");
const checkModelUserAccess = require("../../middleware/checkModelUserAccess");
const isUserLeader = require("../../middleware/isUserLeader");
const userBelongsToGroup = require("../../middleware/userBelongsToGroup");
const isStudentInUniversity = require("../../middleware/isStudentInUniversity");
const DepartmentController = require("../../controllers/DepartmentController");

const router = express.Router();

router.get(
  '/:facultyId/departments',
  isAuthenticated,
  param('facultyId').isInt({min: 1}),
  checkValidationErrors,
  checkModelUserAccess('Faculty', 'facultyId', {read: true}),
  DepartmentController.getAllByFacultyId
)
router.post(
  '/:facultyId/departments',
  isAuthenticated,
  isUserLeader,
  userBelongsToGroup(false),
  param('facultyId').isInt({min: 1}),
  body('name').isString().notEmpty(),
  body('fullName').isString().notEmpty().optional(),
  checkValidationErrors,
  checkModelUserAccess('Faculty', 'facultyId', {read: true}),
  isStudentInUniversity,
  DepartmentController.create
)

module.exports = router