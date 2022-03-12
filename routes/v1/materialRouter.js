const express = require("express");
const {param, body, query} = require("express-validator");
const isAuthenticated = require("../../middleware/isAuthenticated");
const isUserLeader = require("../../middleware/isUserLeader");
const checkValidationErrors = require("../../middleware/checkValidationErrors");
const uploadFileMiddleware = require("../../middleware/uploadFileMiddleware");
const checkModelUserAccess = require("../../middleware/checkModelUserAccess");
const userBelongsToGroup = require("../../middleware/userBelongsToGroup");
const MaterialController = require("../../controllers/MaterialController");

const router = express.Router();

router.use(isAuthenticated)
router.use(userBelongsToGroup(true))

router.get(
  '/:materialId',
  param('materialId').isInt({min: 1}),
  checkValidationErrors,
  checkModelUserAccess('Material', 'materialId', {read: true}),
  MaterialController.getOne
)

router.get(
  '/',
  query('limit').isInt({min: 1}).optional(),
  query('offset').isInt({min: 0}).optional(),
  checkValidationErrors,
  MaterialController.getAll
)

router.post(
  '/',
  isUserLeader,
  uploadFileMiddleware.array("files", 10),
  body('name').isString().notEmpty(),
  body('content').isString(),
  body('access').isIn(['group', 'university']),
  checkValidationErrors,
  MaterialController.create
)

router.patch(
  '/:materialId',
  isUserLeader,
  param('materialId').isInt({min: 1}),
  checkValidationErrors,
  uploadFileMiddleware.array("files", 10),
  body('name').isString().notEmpty(),
  body('content').isString(),
  body('access').isIn(['group', 'university']),
  checkValidationErrors,
  checkModelUserAccess('Material', 'materialId', {write: true}),
  MaterialController.update
)

router.delete(
  '/:materialId',
  isUserLeader,
  param('materialId').isInt({min: 1}),
  checkValidationErrors,
  checkModelUserAccess('Material', 'materialId', {write: true}),
  MaterialController.delete
)

module.exports = router