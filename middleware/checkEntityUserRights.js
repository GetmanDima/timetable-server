const db = require("../models");
const {getRoleRightActions} = require("../helpers");

module.exports = (modelName, paramIdName, actions) => async (req, res, next) => {
  const id = req.params[paramIdName]
  const tableName = db[modelName].tableName
  const user = req.user

  try {
    const model = await db[modelName].findByPk(id, {attributes: ['id']})

    if (!model) {
      return res.sendStatus(404)
    }

    req[modelName] = model

    let roleRights

    if (user) {
      [roleRights] = await db.sequelize.query(
        `SELECT * FROM "Roles_Rights"` +
        `WHERE "roleId" IN (SELECT "roleId" FROM "Users_Roles" WHERE "userId"=${req.user.id})` +
        `AND "rightId"=(SELECT "rightId" FROM "${tableName}" WHERE "id"=${id})`
      );
    } else {
      [roleRights] = await db.sequelize.query(
        `SELECT * FROM "Roles_Rights"` +
        `WHERE "roleId" = (SELECT id FROM "Roles" WHERE name='all')` +
        `AND "rightId"=(SELECT "rightId" FROM "${tableName}" WHERE "id"=${id})`
      );
    }

    const roleRightActions = getRoleRightActions(roleRights)

    for (const action of actions) {
      if (roleRightActions.includes(action)) {
        return next()
      }
    }

    return res.sendStatus(403)
  } catch (_) {
    res.sendStatus(500)
  }
}
