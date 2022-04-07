const db = require("../models");

module.exports = (modelName, paramIdName, additionalAttributes = [], location = 'params') => async (req, res, next) => {
  const model = await db[modelName].findByPk(
    req[location][paramIdName],
    {attributes: ['id', ...additionalAttributes]}
  )

  if (!model) {
    return res.sendStatus(404)
  }

  req[modelName] = model
  next()
}
