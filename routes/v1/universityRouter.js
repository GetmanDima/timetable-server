const express = require("express");
const {body, param, query} = require("express-validator");
const isAuthenticated = require("../../middleware/isAuthenticated");
const isUserLeader = require("../../middleware/isUserLeader");
const checkValidationErrors = require("../../middleware/checkValidationErrors");
const checkModelUserAccess = require("../../middleware/checkModelUserAccess");
const isStudentInUniversity = require("../../middleware/isStudentInUniversity");
const userBelongsToGroup = require("../../middleware/userBelongsToGroup");
const UniversityController = require("../../controllers/UniversityController");
const FacultyController = require("../../controllers/FacultyController");
const CampusController = require("../../controllers/CampusController");
const SubjectController = require("../../controllers/SubjectController");
const TeacherController = require("../../controllers/TeacherController");

const router = express.Router();

router.use(isAuthenticated)

router.get(
  '/',
  query("limit").isInt({min: 1, max: 50}).optional(),
  query("offset").isInt({min: 0}).optional(),
  query("search").isString().optional(),
  UniversityController.getAll
)
router.post(
  '/',
  isUserLeader,
  userBelongsToGroup(false),
  body('name').notEmpty(),
  body('fullName').notEmpty().optional(),
  body('address').notEmpty().optional(),
  checkValidationErrors,
  UniversityController.create
)
router.get(
  '/:universityId',
  param('universityId').isInt({min: 1}),
  checkValidationErrors,
  checkModelUserAccess('University', 'universityId', {read: true}),
  UniversityController.getOne
)
router.patch(
  '/:universityId',
  isUserLeader,
  param('universityId').isInt({min: 1}),
  body('name').notEmpty(),
  body('fullName').notEmpty().optional(),
  body('address').notEmpty().optional(),
  checkValidationErrors,
  checkModelUserAccess('University', 'universityId', {write: true}),
  UniversityController.update
)

router.get(
  '/:universityId/faculties',
  param('universityId').isInt({min: 1}),
  checkValidationErrors,
  checkModelUserAccess('University', 'universityId', {read: true}),
  FacultyController.getAllByUniversityId
)
router.post(
  '/:universityId/faculties',
  isUserLeader,
  userBelongsToGroup(false),
  param('universityId').isInt({min: 1}),
  body('name').notEmpty(),
  body('fullName').notEmpty().optional(),
  checkValidationErrors,
  isStudentInUniversity,
  FacultyController.create
)

router.get(
  '/:universityId/campuses',
  isAuthenticated,
  userBelongsToGroup(true),
  param('universityId').isInt({min: 1}),
  checkValidationErrors,
  isStudentInUniversity,
  CampusController.getAllByUniversityId
)
router.post(
  '/:universityId/campuses',
  isAuthenticated,
  isUserLeader,
  userBelongsToGroup(true),
  param('universityId').isInt({min: 1}),
  body('name').notEmpty(),
  body('address').notEmpty().optional(),
  checkValidationErrors,
  isStudentInUniversity,
  CampusController.create
)

router.get(
  '/:universityId/teachers',
  isAuthenticated,
  userBelongsToGroup(true),
  param('universityId').isInt({min: 1}),
  checkValidationErrors,
  isStudentInUniversity,
  TeacherController.getAllByUniversityId
)
router.post(
  '/:universityId/teachers',
  isAuthenticated,
  isUserLeader,
  userBelongsToGroup(true),
  param('universityId').isInt({min: 1}),
  body('name').notEmpty(),
  checkValidationErrors,
  isStudentInUniversity,
  TeacherController.create
)

router.get(
  '/:universityId/subjects',
  isAuthenticated,
  userBelongsToGroup(true),
  param('universityId').isInt({min: 1}),
  checkValidationErrors,
  isStudentInUniversity,
  SubjectController.getAllByUniversityId
)
router.post(
  '/:universityId/subjects',
  isAuthenticated,
  isUserLeader,
  userBelongsToGroup(true),
  param('universityId').isInt({min: 1}),
  body('name').notEmpty(),
  checkValidationErrors,
  isStudentInUniversity,
  SubjectController.create
)

module.exports = router
