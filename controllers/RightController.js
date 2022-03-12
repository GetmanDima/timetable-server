const db = require("../models")

class RightController {
  static async _getAllWidthRights(req, res,
                                      entity = {modelName: null, attributes}) {
    try {
      const models = await db[entity.modelName].findAll({
        include: {
          model: db.Role,
          include: {
            model: db.User,
            through: {
              where: {
                userId: req.user.id
              }
            },
            attributes: []
          },
          through: {
            where: {
              read: true
            },
            attributes: []
          },
          attributes: [],
          required: true
        },
        attributes: entity.attributes
      })

      res.json(models)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static _includeRightsCheck(user, requiredRights) {
    return {
      model: db.Role,
      include: {
        model: db.User,
        through: {
          where: {
            userId: user.id
          }
        },
        required: true,
        attributes: []
      },
      through: {
        where: requiredRights,
        attributes: [],
      },
      attributes: [],
      required: true
    }
  }

  static async _createWithRights(user, modelName, data,
                                 withStudentReaderRole = true, additionalRolesWithRights = [],
                                 transactionCb = (transaction, user, entityModel) => {}) {
    return await db.sequelize.transaction(async (t) => {
      const entityModel = await db[modelName].create(
        data,
        {transaction: t}
      )

      const creatorRole = await db.Role.create(
        {name: `creator_${modelName.toLowerCase()}_${entityModel.id}`},
        {transaction: t}
      )

      await user.addRole(creatorRole, {transaction: t})

      await entityModel.addRole(
        creatorRole,
        {through: {read: true, write: true}, transaction: t}
      )

      if (withStudentReaderRole) {
        const studentRole = await db.Role.create(
          {name: `student_${modelName.toLowerCase()}_${entityModel.id}`},
          {transaction: t}
        )

        await user.addRole(studentRole, {transaction: t})

        await entityModel.addRole(
          studentRole,
          {through: {read: true, write: false}, transaction: t}
        )
      }

      for (const roleRight of additionalRolesWithRights) {
        if (roleRight.addToUser) {
          await user.addRole(roleRight.role, {transaction: t})
        }

        await entityModel.addRole(
          roleRight.role,
          {through: roleRight.rights, transaction: t}
        )
      }

      await transactionCb(t, user, entityModel)

      return entityModel
    })
  }
}

module.exports = RightController