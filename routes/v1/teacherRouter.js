const express = require("express");
const {body, param, query} = require("express-validator");
const handleValidationErrors = require("../../middleware/handleValidationErrors");
const checkIfEntityExists = require("../../middleware/checkIfEntityExists");
const TeacherController = require("../../controllers/TeacherController");
const isEntityInTimetable = require("../../middleware/isEntityInTimetable");

const router = express.Router({mergeParams: true});

router.get(
  '/',
  query("limit").isInt({min: 1, max: 50}).optional(),
  query("offset").isInt({min: 0}).optional(),
  handleValidationErrors,
  TeacherController.getAllByTimetableId
)

router.post(
  '/',
  body('name').isString().notEmpty(),
  handleValidationErrors,
  TeacherController.create
)

router.get(
  '/:teacherId',
  param('teacherId').isInt({min: 1}),
  handleValidationErrors,
  TeacherController.getOne
)

router.patch(
  '/:teacherId',
  param('teacherId').isInt({min: 1}),
  body('name').isString().notEmpty(),
  handleValidationErrors,
  checkIfEntityExists('Teacher', 'teacherId', ['timetableId']),
  isEntityInTimetable('Teacher'),
  TeacherController.update
)

router.delete(
  '/:teacherId',
  param('teacherId').isInt({min: 1}),
  handleValidationErrors,
  checkIfEntityExists('Teacher', 'teacherId', ['timetableId']),
  isEntityInTimetable('Teacher'),
  TeacherController.delete
)

module.exports = router
