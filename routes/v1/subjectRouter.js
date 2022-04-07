const express = require("express");
const {body, param, query} = require("express-validator");
const handleValidationErrors = require("../../middleware/handleValidationErrors");
const checkIfEntityExists = require("../../middleware/checkIfEntityExists");
const SubjectController = require("../../controllers/SubjectController");
const isEntityInTimetable = require("../../middleware/isEntityInTimetable");

const router = express.Router({mergeParams: true});

router.get(
  '/',
  query("limit").isInt({min: 1, max: 50}).optional(),
  query("offset").isInt({min: 0}).optional(),
  handleValidationErrors,
  SubjectController.getAllByTimetableId
)

router.post(
  '/',
  body('name').isString().notEmpty(),
  handleValidationErrors,
  SubjectController.create
)

router.get(
  '/:subjectId',
  param('subjectId').isInt({min: 1}),
  handleValidationErrors,
  SubjectController.getOne
)

router.patch(
  '/:subjectId',
  param('subjectId').isInt({min: 1}),
  body('name').isString().notEmpty(),
  handleValidationErrors,
  checkIfEntityExists('Subject', 'subjectId', ['timetableId']),
  isEntityInTimetable('Subject'),
  SubjectController.update
)

router.delete(
  '/:subjectId',
  param('subjectId').isInt({min: 1}),
  handleValidationErrors,
  checkIfEntityExists('Subject', 'subjectId', ['timetableId']),
  isEntityInTimetable('Subject'),
  SubjectController.delete
)

module.exports = router
