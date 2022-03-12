const express = require("express");
const {param, body} = require("express-validator");
const checkValidationErrors = require("../../middleware/checkValidationErrors");
const isAuthenticated = require("../../middleware/isAuthenticated");
const checkModelExists = require("../../middleware/checkModelExists");
const isUserLeader = require("../../middleware/isUserLeader");
const userBelongsToGroup = require("../../middleware/userBelongsToGroup");
const GroupInviteController = require("../../controllers/GroupInviteController");

const router = express.Router();

router.use(isAuthenticated)
router.use(userBelongsToGroup(true))

router.get(
  '/:groupInviteId',
  param('groupInviteId').isInt({min: 1}),
  checkValidationErrors,
  checkModelExists('GroupInviteCode', 'groupInviteId'),
  GroupInviteController.getOne
)

router.patch(
  '/:groupInviteId',
  isUserLeader,
  param('groupInviteId').isInt({min: 1}),
  body('code').isString().notEmpty(),
  checkValidationErrors,
  checkModelExists('GroupInviteCode', 'groupInviteId'),
  GroupInviteController.update
)

router.delete(
  '/:groupInviteId',
  isUserLeader,
  param('groupInviteId').isInt({min: 1}),
  checkValidationErrors,
  checkModelExists('GroupInviteCode', 'groupInviteId'),
  GroupInviteController.delete
)

module.exports = router