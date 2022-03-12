const express = require("express");
const {body, param} = require("express-validator");
const isAuthenticated = require("../../middleware/isAuthenticated");
const isUserLeader = require("../../middleware/isUserLeader");
const checkValidationErrors = require("../../middleware/checkValidationErrors");
const uploadFileMiddleware = require("../../middleware/uploadFileMiddleware");
const checkModelUserAccess = require("../../middleware/checkModelUserAccess");
const userBelongsToGroup = require("../../middleware/userBelongsToGroup");
const SubjectController = require("../../controllers/SubjectController");
const MaterialController = require("../../controllers/MaterialController");

const router = express.Router();

router.use(isAuthenticated)
router.use(userBelongsToGroup(true))

router.get(
  '/:subjectId',
  param('subjectId').isInt({min: 1}),
  checkValidationErrors,
  checkModelUserAccess('Subject', 'subjectId', {read: true}),
  SubjectController.getOne
)

router.patch(
  '/:subjectId',
  isUserLeader,
  param('subjectId').isInt({min: 1}),
  body('name').notEmpty(),
  checkValidationErrors,
  checkModelUserAccess('Subject', 'subjectId', {write: true}),
  SubjectController.update
)

router.delete(
  '/:subjectId',
  isUserLeader,
  param('subjectId').isInt({min: 1}),
  checkValidationErrors,
  checkModelUserAccess('Subject', 'subjectId', {write: true}),
  SubjectController.delete
)

router.get(
  '/:subjectId/materials',
  param('subjectId').isInt({min: 1}),
  checkValidationErrors,
  checkModelUserAccess('Subject', 'subjectId', {read: true}),
  MaterialController.getAll
)

router.post(
  '/:subjectId/materials',
  isUserLeader,
  param('subjectId').isInt({min: 1}),
  uploadFileMiddleware.array("files", 10),
  body('name').isString().notEmpty(),
  body('content').isString(),
  body('access').isIn(['group', 'university']),
  checkValidationErrors,
  checkModelUserAccess('Subject', 'subjectId', {read: true}),
  MaterialController.create
)

module.exports = router