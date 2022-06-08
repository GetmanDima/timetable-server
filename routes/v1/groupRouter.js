const express = require("express");
const {param, body} = require("express-validator");
const handleValidationErrors = require("../../middleware/handleValidationErrors");
const isAuthenticated = require("../../middleware/isAuthenticated");
const getUserIfAuthenticated = require("../../middleware/getUserIfAuthenticated");
const userBelongsToGroup = require("../../middleware/userBelongsToGroup");
const isUserLeader = require("../../middleware/isUserLeader");
const checkEntityUserRights = require("../../middleware/checkEntityUserRights")
const checkIfEntityExists = require("../../middleware/checkIfEntityExists")
const GroupController = require("../../controllers/GroupController");
const GroupInviteController = require("../../controllers/GroupInviteController");
const TimetableController = require("../../controllers/TimetableController")

const router = express.Router();

router.get(
  '/:groupId',
  param('groupId').isInt({min: 1}),
  handleValidationErrors,
  getUserIfAuthenticated,
  (req, res, next) => {
    return req.user
      ? userBelongsToGroup(true)(req, res, next)
      : checkEntityUserRights("Group", "groupId", ["r"])(req, res, next)
  },
  GroupController.getOne
)

router.patch(
  '/:groupId',
  param('groupId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  body('name').isString().notEmpty().optional(),
  body('fullName').isString().notEmpty().optional(),
  body('courseNumber').isInt({min: 1, max: 20}).optional(),
  body('admissionYear').isInt({min: 2000, max: new Date().getFullYear()}).optional(),
  handleValidationErrors,
  checkEntityUserRights("Group", "groupId", ["w"]),
  GroupController.update
)

router.get(
  '/:groupId/identifier',
  param('groupId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  checkEntityUserRights("Group", "groupId", ["w"]),
  GroupController.getIdentifier
)

router.get(
  '/:groupId/invites',
  param('groupId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  isUserLeader,
  checkIfEntityExists('Group', 'groupId'),
  GroupInviteController.getAllByGroupId
)

router.post(
  '/:groupId/invites',
  param('groupId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  isUserLeader,
  body('code').isString().notEmpty(),
  handleValidationErrors,
  checkIfEntityExists('Group', 'groupId'),
  GroupInviteController.create
)

router.get(
  '/:groupId/users',
  param('groupId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  userBelongsToGroup(true),
  GroupController.getUsers
)

router.get(
  '/:groupId/timetables',
  param('groupId').isInt({min: 1}),
  handleValidationErrors,
  getUserIfAuthenticated,
  checkIfEntityExists('Group', 'groupId'),
  TimetableController.getAllByGroupId
)

module.exports = router
