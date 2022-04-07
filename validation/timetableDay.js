const checkIfEntityExists = require("../middleware/checkIfEntityExists");

exports.createUpdateRules = [
  (req, res, next) => {
    return req.body['classTimeId']
      ? checkIfEntityExists('ClassTime', 'classTimeId', [], 'body')
      : next()
  },
  (req, res, next) => {
    return req.body['subjectId']
      ? checkIfEntityExists('Subject', 'subjectId', [], 'body')
      : next()
  },
  (req, res, next) => {
    return req.body['teacherId']
      ? checkIfEntityExists('Teacher', 'teacherId', [], 'body')
      : next()
  },
  (req, res, next) => {
    return req.body['campusId']
      ? checkIfEntityExists('Campus', 'campusId', [], 'body')
      : next()
  },
]
