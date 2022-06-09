const express = require("express");
const {param, body, query} = require("express-validator");
const handleValidationErrors = require("../../middleware/handleValidationErrors");
const isAuthenticated = require("../../middleware/isAuthenticated");
const isUserInGroup = require("../../middleware/isUserInGroup");
const isUserLeader = require("../../middleware/isUserLeader");
const checkEntityUserRights = require("../../middleware/checkEntityUserRights");
const uploadFileMiddleware = require("../../middleware/uploadFileMiddleware");
const MaterialController = require("../../controllers/MaterialController");

const router = express.Router();

router.get(
  '/',
  query('limit').isInt({min: 1}).optional(),
  query('offset').isInt({min: 0}).optional(),
  handleValidationErrors,
  isAuthenticated,
  MaterialController.getAll
)

router.post(
  '/',
  isAuthenticated,
  isUserInGroup(true),
  isUserLeader,
  uploadFileMiddleware.array("files", 10),
  body('name').isString().notEmpty(),
  body('content').isString().optional(),
  handleValidationErrors,
  MaterialController.create
)

router.get(
  '/:materialId',
  param('materialId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  checkEntityUserRights('Material', 'materialId', ['r']),
  MaterialController.getOne
)

router.patch(
  '/:materialId',
  param('materialId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  uploadFileMiddleware.array("files", 10),
  body('name').isString().notEmpty().optional(),
  body('content').isString().optional(),
  handleValidationErrors,
  checkEntityUserRights('Material', 'materialId', ['w']),
  MaterialController.update
)

router.delete(
  '/:materialId',
  param('materialId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  checkEntityUserRights('Material', 'materialId', ['w']),
  MaterialController.delete
)

module.exports = router
