const express = require("express");
const {body, param, query} = require("express-validator");
const isAuthenticated = require("../../middleware/isAuthenticated");
const handleValidationErrors = require("../../middleware/handleValidationErrors");
const getAuthenticatedUser = require("../../middleware/getUserIfAuthenticated");
const isUserLeader = require("../../middleware/isUserLeader");
const isUserInGroup = require("../../middleware/isUserInGroup");
const checkEntityUserRights = require("../../middleware/checkEntityUserRights");
const checkIfEntityExists = require("../../middleware/checkIfEntityExists")
const UniversityController = require("../../controllers/UniversityController");
const GroupController = require("../../controllers/GroupController");

const router = express.Router();

router.get(
  '/',
  query("limit").isInt({min: 1, max: 50}).optional(),
  query("offset").isInt({min: 0}).optional(),
  query("search").isString().optional(),
  query("parsed").isIn([0, 1]).optional(),
  handleValidationErrors,
  getAuthenticatedUser,
  UniversityController.getAll
)

router.post(
  '/',
  isAuthenticated,
  isUserLeader,
  isUserInGroup(false),
  body('name').notEmpty(),
  body('fullName').notEmpty().optional(),
  body('address').notEmpty().optional(),
  handleValidationErrors,
  UniversityController.create
)
router.get(
  '/:universityId',
  param('universityId').isInt({min: 1}),
  handleValidationErrors,
  getAuthenticatedUser,
  checkEntityUserRights('University', 'universityId', ['r']),
  UniversityController.getOne
)
router.patch(
  '/:universityId',
  param('universityId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  body('name').notEmpty().optional(),
  body('fullName').notEmpty().optional(),
  body('address').notEmpty().optional(),
  handleValidationErrors,
  checkEntityUserRights('University', 'universityId', ['w']),
  UniversityController.update
)

router.get(
  '/:universityId/groups',
  param("universityId").isInt({min: 1}),
  query("limit").isInt({min: 1, max: 50}).optional(),
  query("offset").isInt({min: 0}).optional(),
  query("search").isString().optional(),
  query("parsed").isIn([0, 1]).optional(),
  handleValidationErrors,
  getAuthenticatedUser,
  checkEntityUserRights('University', 'universityId', ['r']),
  GroupController.getAllByUniversityId
)

router.post(
  '/:universityId/groups',
  param("universityId").isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  isUserInGroup(false),
  body('name').isString().notEmpty(),
  body('fullName').isString().notEmpty().optional(),
  body('courseNumber').isInt({min: 1, max: 20}).optional(),
  body('admissionYear').isInt({min: 2000, max: new Date().getFullYear()}).optional(),
  handleValidationErrors,
  checkEntityUserRights('University', 'universityId', ['r']),
  GroupController.create
)

module.exports = router
