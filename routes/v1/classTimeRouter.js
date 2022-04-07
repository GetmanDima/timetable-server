const express = require("express");
const {param, body, query} = require("express-validator");
const handleValidationErrors = require("../../middleware/handleValidationErrors");
const checkIfEntityExists = require("../../middleware/checkIfEntityExists");
const ClassTimeController = require("../../controllers/ClassTimeController");
const isEntityInTimetable = require("../../middleware/isEntityInTimetable");

const router = express.Router({mergeParams: true});

router.get(
  '/',
  query("limit").isInt({min: 1, max: 50}).optional(),
  query("offset").isInt({min: 0}).optional(),
  handleValidationErrors,
  ClassTimeController.getAllByTimetableId
)

router.post(
  '/',
  body('number').isInt({min: 1}),
  body('startTime').notEmpty().matches('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$'),
  body('endTime').notEmpty().matches('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$'),
  handleValidationErrors,
  ClassTimeController.create
)

router.get(
  '/:classTimeId',
  param('classTimeId').isInt({min: 1}),
  handleValidationErrors,
  ClassTimeController.getOne
)

router.patch(
  '/:classTimeId',
  param('classTimeId').isInt({min: 1}).optional(),
  body('number').isInt({min: 1}).optional(),
  body('startTime').notEmpty().matches('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$').optional(),
  body('endTime').notEmpty().matches('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$').optional(),
  handleValidationErrors,
  checkIfEntityExists('ClassTime', 'classTimeId', ['timetableId']),
  isEntityInTimetable('ClassTime'),
  ClassTimeController.update
)

router.delete(
  '/:classTimeId',
  param('classTimeId').isInt({min: 1}),
  handleValidationErrors,
  checkIfEntityExists('ClassTime', 'classTimeId', ['timetableId']),
  isEntityInTimetable('ClassTime'),
  ClassTimeController.delete
)

module.exports = router
