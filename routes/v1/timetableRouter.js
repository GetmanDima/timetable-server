const express = require("express");
const {param, body, query} = require("express-validator");
const handleValidationErrors = require("../../middleware/handleValidationErrors");
const isAuthenticated = require("../../middleware/isAuthenticated");
const getUserIfAuthenticated = require("../../middleware/getUserIfAuthenticated");
const checkEntityUserRights = require("../../middleware/checkEntityUserRights");
const {checkChildRouterUserRights} = require("../../validation/timetable");
const TimetableController = require("../../controllers/TimetableController");
const timetableLessonRouter = require("./timetableLessonRouter")
const classTimeRouter = require("./classTimeRouter")
const subjectRouter = require("./subjectRouter")
const teacherRouter = require("./teacherRouter")
const campusRouter = require("./teacherRouter")
const weekTypeRouter = require("./weekTypeRouter")

const router = express.Router();

router.get(
  '/',
  query("limit").isInt({min: 1, max: 50}).optional(),
  query("offset").isInt({min: 0}).optional(),
  query("search").isString().optional(),
  query("parsed").isIn([0, 1]).optional(),
  handleValidationErrors,
  getUserIfAuthenticated,
  TimetableController.getAll
)

router.post(
  '/',
  isAuthenticated,
  body('name').isString().notEmpty(),
  body('personal').isBoolean().optional(),
  handleValidationErrors,
  TimetableController.create
)

router.get(
  '/:timetableId',
  param('timetableId').isInt({min: 1}),
  handleValidationErrors,
  getUserIfAuthenticated,
  query('lessons').isBoolean().optional(),
  handleValidationErrors,
  checkEntityUserRights('Timetable', 'timetableId', ['r']),
  TimetableController.getOne
)

router.patch(
  '/:timetableId',
  param('timetableId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  body('name').isString().notEmpty(),
  handleValidationErrors,
  checkEntityUserRights('Timetable', 'timetableId', ['w']),
  TimetableController.update
)

router.delete(
  '/:timetableId',
  param('timetableId').isInt({min: 1}),
  handleValidationErrors,
  isAuthenticated,
  body('name').isString().notEmpty(),
  handleValidationErrors,
  checkEntityUserRights('Timetable', 'timetableId', ['w']),
  TimetableController.delete
)

router.use(
  '/:timetableId/lessons',
  param('timetableId').isInt({min: 1}),
  handleValidationErrors,
  getUserIfAuthenticated,
  checkChildRouterUserRights,
  timetableLessonRouter
)

router.use(
  '/:timetableId/class-times',
  param('timetableId').isInt({min: 1}),
  handleValidationErrors,
  getUserIfAuthenticated,
  checkChildRouterUserRights,
  classTimeRouter
)

router.use(
  '/:timetableId/subjects',
  param('timetableId').isInt({min: 1}),
  handleValidationErrors,
  getUserIfAuthenticated,
  checkChildRouterUserRights,
  subjectRouter
)

router.use(
  '/:timetableId/teachers',
  param('timetableId').isInt({min: 1}),
  handleValidationErrors,
  getUserIfAuthenticated,
  checkChildRouterUserRights,
  teacherRouter
)

router.use(
  '/:timetableId/campuses',
  param('timetableId').isInt({min: 1}),
  handleValidationErrors,
  getUserIfAuthenticated,
  checkChildRouterUserRights,
  campusRouter
)

router.use(
  '/:timetableId/week-types',
  param('timetableId').isInt({min: 1}),
  handleValidationErrors,
  getUserIfAuthenticated,
  checkChildRouterUserRights,
  weekTypeRouter
)

module.exports = router
