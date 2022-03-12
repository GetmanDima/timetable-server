const express = require("express");
const {param, body, query} = require("express-validator");
const isAuthenticated = require("../../middleware/isAuthenticated");
const isUserLeader = require("../../middleware/isUserLeader");
const checkValidationErrors = require("../../middleware/checkValidationErrors");
const checkModelUserAccess = require("../../middleware/checkModelUserAccess");
const userBelongsToGroup = require("../../middleware/userBelongsToGroup");
const CampusController = require("../../controllers/CampusController");
const TeacherController = require("../../controllers/TeacherController");

const router = express.Router();

router.use(isAuthenticated)
router.use(userBelongsToGroup(true))

router.get(
  '/:teacherId',
  param('teacherId').isInt({min: 1}),
  checkValidationErrors,
  checkModelUserAccess('Teacher', 'teacherId', {read: true}),
  TeacherController.getOne
)

router.patch(
  '/:teacherId',
  isUserLeader,
  param('teacherId').isInt({min: 1}),
  body('name').isString(),
  checkValidationErrors,
  checkModelUserAccess('Teacher', 'teacherId', {write: true}),
  TeacherController.update
)

router.delete(
  '/:teacherId',
  isUserLeader,
  param('teacherId').isInt({min: 1}),
  checkValidationErrors,
  checkModelUserAccess('Teacher', 'teacherId', {write: true}),
  CampusController.delete
)

module.exports = router