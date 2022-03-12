const db = require("../models");

module.exports = (modelName, paramIdName, rights) => async (req, res, next) => {
  const id = req.params[paramIdName]
  const user = req.user

  try {
    const model = await db[modelName].findByPk(id, {attributes: ['id']})

    if (!model) {
      return res.sendStatus(404)
    }

    const matchedRoles = await model.getRoles(
      {
        include: [{
          model: db.User,
          through: {
            where: {
              userId: user.id
            }
          },
          required: true,
          attributes: []
        }],
        through: {
          where: rights,
          attributes: [],
        },
        includeIgnoreAttributes: false,
        attributes: []
      }
    )

    if (matchedRoles.length === 0) {
      return res.sendStatus(403)
    }

    next()
  } catch (_) {
    res.sendStatus(500)
  }
}
