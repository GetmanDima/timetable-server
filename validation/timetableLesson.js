const db = require("../models");

const check = (id, modelName) => async (req, res, next) => {
  const model = await db[modelName].findByPk(
    id,
    {attributes: ['id', 'timetableId']}
  )

  if (!model || model.timetableId !== parseInt(req.params['timetableId'])) {
    return res.sendStatus(400)
  }

  req[modelName] = model
  next()
}

exports.createUpdateRules = [
  (req, res, next) => {
    return req.body['weekTypeId']
      ? check(req.body["weekTypeId"], "WeekType")(req, res, next)
      : next()
  },
  (req, res, next) => {
    return req.body['classTimeId']
      ? check(req.body["classTimeId"], "ClassTime")(req, res, next)
      : next()
  },
  (req, res, next) => {
    return req.body['subjectId']
      ? check(req.body["subjectId"], "Subject")(req, res, next)
      : next()
  },
  (req, res, next) => {
    return req.body['teacherId']
      ? check(req.body["teacherId"], "Teacher")(req, res, next)
      : next()
  },
  (req, res, next) => {
    return req.body['campusId']
      ? check(req.body["campusId"], "Campus")(req, res, next)
      : next()
  },
]
