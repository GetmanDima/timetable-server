const express = require("express");
const {param, body, query} = require("express-validator");
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
  checkEntityUserRights("Group", "groupId", ["r"]),
  GroupController.getOne
)

router.patch(
  '/:groupId',
  param('groupId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  isUserLeader,
  (req, res, next) => userBelongsToGroup(req.params.groupId)(req, res, next),
  body('name').isString().notEmpty().optional(),
  body('fullName').isString().notEmpty().optional(),
  body('courseNumber').isInt({min: 1, max: 20}).optional(),
  body('admissionYear').isInt({min: 2000, max: new Date().getFullYear()}).optional(),
  handleValidationErrors,
  GroupController.update
)

router.get(
  '/:groupId/identifier',
  param('groupId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  isUserLeader,
  (req, res, next) => userBelongsToGroup(req.params.groupId)(req, res, next),
  GroupController.getIdentifier
)

router.get(
  '/:groupId/invites',
  param('groupId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  isUserLeader,
  (req, res, next) => userBelongsToGroup(req.params.groupId)(req, res, next),
  GroupInviteController.getAllByGroupId
)

router.post(
  '/:groupId/invites',
  param('groupId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  isUserLeader,
  (req, res, next) => userBelongsToGroup(req.params.groupId)(req, res, next),
  body('code').isString().notEmpty(),
  handleValidationErrors,
  GroupInviteController.create
)

router.get(
  '/:groupId/users',
  param('groupId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  (req, res, next) => userBelongsToGroup(req.params.groupId)(req, res, next),
  GroupController.getUsers
)

router.delete(
  '/:groupId/users/:userId',
  param('groupId').isInt({min: 1}),
  param('userId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  isUserLeader,
  (req, res, next) => userBelongsToGroup(req.params.groupId)(req, res, next),
  checkIfEntityExists('Group', 'groupId', ['universityId']),
  checkIfEntityExists('User', 'userId', ['type']),
  (req, res, next) => {
    if (req.User.type === "leader") {
      return res.sendStatus(403)
    }
    next()
  },
  GroupController.deleteUser
)

router.get(
  '/:groupId/timetables',
  param('groupId').isInt({min: 1}),
  handleValidationErrors,
  getUserIfAuthenticated,
  query('limit').isInt({min: 1}).optional(),
  query('offset').isInt({min: 0}).optional(),
  handleValidationErrors,
  checkEntityUserRights("Group", "groupId", ["r"]),
  TimetableController.getAllByGroupId
)

module.exports = router
