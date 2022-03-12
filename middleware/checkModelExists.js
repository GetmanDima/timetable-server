const db = require("../models");

module.exports = (modelName, paramIdName) => async (req, res, next) => {
  if (await db[modelName].count({where: {id: req.params[paramIdName]}}) === 0) {
    return res.sendStatus(404)
  }

  next()
}