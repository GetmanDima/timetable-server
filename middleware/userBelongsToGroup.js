module.exports = (belongs) => {
  return async (req, res, next) => {
    if (belongs && req.user.groupId === null) {
      return res.sendStatus(404)
    }

    if (!belongs && req.user.groupId !== null) {
      return res.sendStatus(404)
    }

    next()
  }
}
