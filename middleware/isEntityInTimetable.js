module.exports = (entityName) => (req, res, next) => {
  if (req[entityName].timetableId !== parseInt(req.params['timetableId'])) {
    return res.sendStatus(404)
  }

  next()
}
