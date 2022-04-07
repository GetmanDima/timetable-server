const express = require("express");
const {param, body, query} = require("express-validator");
const {weekDays} = require("../../helpers");
const handleValidationErrors = require("../../middleware/handleValidationErrors");
const checkIfEntityExists = require("../../middleware/checkIfEntityExists");
const isEntityInTimetable = require("../../middleware/isEntityInTimetable");
const {createUpdateRules} = require("../../validation/timetableDay")
const TimetableDayController = require("../../controllers/TimetableDayController");


const router = express.Router({mergeParams: true});

router.get(
  '/',
  query("limit").isInt({min: 1, max: 50}).optional(),
  query("offset").isInt({min: 0}).optional(),
  handleValidationErrors,
  TimetableDayController.getAllByTimetableId
)

router.post(
  '/',
  body('weekDay').isIn(weekDays).notEmpty(),
  body('weekType').isIn(['all', 'high', 'low']).notEmpty(),
  body('format').isString().optional(),
  body('room').isString().optional(),
  body('classType').isString().optional(),
  body('activeFromDate').isDate().optional(),
  body('activeToDate').isDate().optional(),
  body('classTimeId').isInt({min: 1}).optional(),
  body('subjectId').isInt({min: 1}).optional(),
  body('teacherId').isInt({min: 1}).optional(),
  body('campusId').isInt({min: 1}).optional(),
  createUpdateRules,
  handleValidationErrors,
  TimetableDayController.create
)

router.get(
  '/:timetableDayId',
  param('timetableDayId').isInt({min: 1}),
  handleValidationErrors,
  TimetableDayController.getOne
)

router.patch(
  '/:timetableDayId',
  param('timetableDayId').isInt({min: 1}),
  handleValidationErrors,
  body('weekDay').isIn(weekDays).optional(),
  body('weekType').isIn(['all', 'high', 'low']).optional(),
  body('format').isString().optional(),
  body('room').isString().optional(),
  body('classType').isString().optional(),
  body('activeFromDate').isDate().optional(),
  body('activeToDate').isDate().optional(),
  body('classTimeId').isInt({min: 1}).optional(),
  body('subjectId').isInt({min: 1}).optional(),
  body('teacherId').isInt({min: 1}).optional(),
  body('campusId').isInt({min: 1}).optional(),
  createUpdateRules,
  handleValidationErrors,
  checkIfEntityExists('TimetableDay', 'timetableDayId', ['timetableId']),
  isEntityInTimetable('TimetableDay'),
  TimetableDayController.update
)

router.delete(
  '/:timetableDayId',
  param('timetableDayId').isInt({min: 1}),
  handleValidationErrors,
  checkIfEntityExists('TimetableDay', 'timetableDayId', ['timetableId']),
  isEntityInTimetable('TimetableDay'),
  TimetableDayController.delete
)

module.exports = router
