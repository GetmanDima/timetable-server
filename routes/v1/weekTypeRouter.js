const express = require("express");
const {body, param, query} = require("express-validator");
const handleValidationErrors = require("../../middleware/handleValidationErrors");
const checkIfEntityExists = require("../../middleware/checkIfEntityExists");
const WeekTypeController = require("../../controllers/WeekTypeController");
const isEntityInTimetable = require("../../middleware/isEntityInTimetable");

const router = express.Router({mergeParams: true});

router.get(
  '/',
  query("limit").isInt({min: 1, max: 50}).optional(),
  query("offset").isInt({min: 0}).optional(),
  handleValidationErrors,
  WeekTypeController.getAllByTimetableId
)

router.post(
  '/',
  body('name').isString().notEmpty(),
  handleValidationErrors,
  WeekTypeController.create
)

router.get(
  '/:weekTypeId',
  param('weekTypeId').isInt({min: 1}),
  handleValidationErrors,
  WeekTypeController.getOne
)

router.patch(
  '/:weekTypeId',
  param('weekTypeId').isInt({min: 1}),
  body('name').isString().notEmpty(),
  handleValidationErrors,
  checkIfEntityExists('WeekType', 'weekTypeId', ['timetableId']),
  isEntityInTimetable('WeekType'),
  WeekTypeController.update
)

router.delete(
  '/:weekTypeId',
  param('weekTypeId').isInt({min: 1}),
  handleValidationErrors,
  checkIfEntityExists('WeekType', 'weekTypeId', ['timetableId']),
  isEntityInTimetable('WeekType'),
  WeekTypeController.delete
)

module.exports = router
