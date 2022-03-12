module.exports = async (req, res, next) => {
  if (parseInt(req.params['groupId']) !== req.user.groupId) {
    return res.sendStatus(403)
  }

  next()
}
