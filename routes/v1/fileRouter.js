const express = require("express");
const {param, query} = require("express-validator");
const db = require("../../models")
const handleValidationErrors = require("../../middleware/handleValidationErrors");
const isAuthenticated = require("../../middleware/isAuthenticated");
const uploadFileMiddleware = require("../../middleware/uploadFileMiddleware");
const FileController = require("../../controllers/FileController");

const router = express.Router();

router.post(
  '/',
  isAuthenticated,
  uploadFileMiddleware.single("file"),
  FileController.create
)

router.delete(
  '/:fileId',
  param('fileId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  async (req, res, next) => {
    try {
      const file = await db.File.findByPk(req.params.fileId, {attributes: ['id', 'materialId', 'userId']})

      if (!file) {
        return res.sendStatus(404)
      }

      if (file.userId !== req.user.id) {
        return res.sendStatus(403)
      }

      req.File = file
      next()
    } catch {
      res.sendStatus(500)
    }
  },

  FileController.delete
)

router.get(
  '/',
  query("unused").isIn([0, 1]).optional(),
  handleValidationErrors,
  isAuthenticated,
  FileController.getAllByUserId
)



module.exports = router
