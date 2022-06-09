module.exports = (isIn) => {
  return async (req, res, next) => {
    if (isIn && req.user.groupId === null) {
      return res.sendStatus(404)
    }

    if (!isIn && req.user.groupId !== null) {
      return res.sendStatus(404)
    }

    next()
  }
}
