const express = require("express");
const {param, body, query} = require("express-validator");
const isAuthenticated = require("../../middleware/isAuthenticated");
const checkValidationErrors = require("../../middleware/checkValidationErrors");
const checkModelUserAccess = require("../../middleware/checkModelUserAccess");
const isUserLeader = require("../../middleware/isUserLeader");
const userBelongsToGroup = require("../../middleware/userBelongsToGroup");
const DepartmentController = require("../../controllers/UniversityStructure/DepartmentController");

const router = express.Router();

router.get(
  '/:facultyId/departments',
  isAuthenticated,
  param('facultyId').isInt({min: 1}),
  query("limit").isInt({min: 1, max: 50}).optional(),
  query("offset").isInt({min: 0}).optional(),
  query("search").isString().optional(),
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
  DepartmentController.create
)

module.exports = router
