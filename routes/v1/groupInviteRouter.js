const express = require("express");
const {param, body} = require("express-validator");
const handleValidationErrors = require("../../middleware/handleValidationErrors");
const isAuthenticated = require("../../middleware/isAuthenticated");
const isUserLeader = require("../../middleware/isUserLeader");
const checkIfEntityExists = require("../../middleware/checkIfEntityExists");
const GroupInviteController = require("../../controllers/GroupInviteController");

const router = express.Router();

router.get(
  '/:groupInviteId',
  param('groupInviteId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  GroupInviteController.getOne
)

router.patch(
  '/:groupInviteId',
  param('groupInviteId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  isUserLeader,
  body('code').isString().notEmpty(),
  handleValidationErrors,
  checkIfEntityExists('GroupInviteCode', 'groupInviteId', ['groupId']),
  GroupInviteController.update
)

router.delete(
  '/:groupInviteId',
  param('groupInviteId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  isUserLeader,
  checkIfEntityExists('GroupInviteCode', 'groupInviteId', ['groupId']),
  GroupInviteController.delete
)

module.exports = router
