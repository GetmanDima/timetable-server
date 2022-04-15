const express = require("express");
const {param, body, query} = require("express-validator");
const {weekDays} = require("../../helpers");
const handleValidationErrors = require("../../middleware/handleValidationErrors");
const checkIfEntityExists = require("../../middleware/checkIfEntityExists");
const isEntityInTimetable = require("../../middleware/isEntityInTimetable");
const {createUpdateRules} = require("../../validation/timetableLesson")
const TimetableLessonController = require("../../controllers/TimetableLessonController");


const router = express.Router({mergeParams: true});

router.get(
  '/',
  query("limit").isInt({min: 1, max: 140}).optional(),
  query("offset").isInt({min: 0}).optional(),
  handleValidationErrors,
  TimetableLessonController.getAllByTimetableId
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
  TimetableLessonController.create
)

router.get(
  '/:timetableLessonId',
  param('timetableLessonId').isInt({min: 1}),
  handleValidationErrors,
  TimetableLessonController.getOne
)

router.patch(
  '/:timetableLessonId',
  param('timetableLessonId').isInt({min: 1}),
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
  checkIfEntityExists('TimetableLesson', 'timetableLessonId', ['timetableId']),
  isEntityInTimetable('TimetableLesson'),
  TimetableLessonController.update
)

router.delete(
  '/:timetableLessonId',
  param('timetableLessonId').isInt({min: 1}),
  handleValidationErrors,
  checkIfEntityExists('TimetableLesson', 'timetableLessonId', ['timetableId']),
  isEntityInTimetable('TimetableLesson'),
  TimetableLessonController.delete
)

module.exports = router
