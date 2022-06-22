const express = require("express");
const {param, body, query} = require("express-validator");
const handleValidationErrors = require("../../middleware/handleValidationErrors");
const isAuthenticated = require("../../middleware/isAuthenticated");
const checkEntityUserRights = require("../../middleware/checkEntityUserRights");
const MaterialController = require("../../controllers/MaterialController");

const checkFileIds = (req, res, next) => {
  if (req.body.files) {
    req.body.files.forEach((fileId) => {
      if (!Number.isInteger(fileId)) {
        return res.sendStatus(400)
      }
    })
  }
  next()
}

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
  body('name').isString().notEmpty(),
  body('content').isString().optional(),
  body('files').isArray().optional(),
  body('target').isIn(['personal', 'group']).optional(),
  handleValidationErrors,
  checkFileIds,
  isAuthenticated,
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
  body('name').isString().notEmpty(),
  body('content').isString().optional(),
  body('files').isArray().optional(),
  handleValidationErrors,
  checkFileIds,
  isAuthenticated,
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
