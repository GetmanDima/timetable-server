const express = require("express");
const {body, param, query} = require("express-validator");
const handleValidationErrors = require("../../middleware/handleValidationErrors");
const checkIfEntityExists = require("../../middleware/checkIfEntityExists");
const isEntityInTimetable = require("../../middleware/isEntityInTimetable")
const CampusController = require("../../controllers/CampusController");

const router = express.Router({mergeParams: true});

router.get(
  '/',
  query("limit").isInt({min: 1, max: 50}).optional(),
  query("offset").isInt({min: 0}).optional(),
  handleValidationErrors,
  CampusController.getAllByTimetableId
)

router.post(
  '/',
  body('name').isString().notEmpty(),
  body('address').isString().optional(),
  handleValidationErrors,
  CampusController.create
)

router.get(
  '/:campusId',
  param('campusId').isInt({min: 1}),
  handleValidationErrors,
  CampusController.getOne
)

router.patch(
  '/:campusId',
  param('campusId').isInt({min: 1}),
  body('name').isString().notEmpty().optional(),
  body('address').isString().optional(),
  handleValidationErrors,
  checkIfEntityExists('Campus', 'campusId', ['timetableId']),
  isEntityInTimetable('Campus'),
  CampusController.update
)

router.delete(
  '/:campusId',
  param('campusId').isInt({min: 1}),
  handleValidationErrors,
  checkIfEntityExists('Campus', 'campusId', ['timetableId']),
  isEntityInTimetable('Campus'),
  CampusController.delete
)

module.exports = router
