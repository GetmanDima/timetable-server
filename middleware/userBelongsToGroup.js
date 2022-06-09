module.exports = (groupId) => {
  return async (req, res, next) => {
    if (!req.user || req.user.groupId !== parseInt(groupId)) {
      return res.sendStatus(403)
    }

    next()
  }
}
