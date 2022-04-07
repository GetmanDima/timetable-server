const db = require("../models")
const {Op} = require("sequelize");
const AppController = require("./AppController")

class RightController extends AppController {
  static async _getAllWithRightsCheck(user, modelName, limit, offset, search = '', additionalConditions = {}) {
    let where = {}

    if (search) {
      where = super._getSearchCondition(search)
    }

    if (additionalConditions) {
      where = {...where, ...additionalConditions}
    }

    const entities = await db[modelName].findAll({
      where,
      include: RightController._includeRightsCheck(user, ['r']),
      limit,
      offset,
      attributes: {
        exclude: ['rightId']
      },
    })

    return entities.map((entity) => {
      const jsonEntity = entity.toJSON()
      delete jsonEntity.Right
      return jsonEntity
    })
  }

  static _includeRightsCheck(user, actions) {
    if (user) {
      return {
        model: db.Right,
        attributes: ['id'],
        include: {
          model: db.Role,
          attributes: [],
          through: {
            where: {
              action: {
                [Op.in]: actions
              }
            },
            attributes: []
          },
          include: {
            model: db.User,
            where: {
              id: user.id
            },
            attributes: [],
            required: true
          },
          required: true
        }
      }
    } else {
      return {
        model: db.Right,
        attributes: ['id'],
        include: {
          model: db.Role,
          attributes: [],
          where: {
            name: 'all'
          },
          through: {
            where: {
              action: {
                [Op.in]: actions
              }
            },
            attributes: []
          },
        }
      }
    }
  }

  static async _createWithRights(user, modelName, data,
                                 withStudentGroupRole = true, additionalRolesWithActions = [],
                                 transactionCb = (transaction, user, entityModel) => {}) {
    const userIndividualRole = await db.Role.findOne({
      where: {name: `user_${user.id}`},
      attributes: ['id']
    })

    let studentGroupRole

    if (withStudentGroupRole) {
      studentGroupRole = await db.Role.findOne(
        {name: `student_group_${user.groupId}`}
      )

      if (!studentGroupRole) {
        throw `Not found student_group_${user.groupId} role`
      }
    }

    if (!userIndividualRole) {
      throw `Not found user_${user.id} role`
    }

    const right = await db.Right.create({})

    if (!right) {
      throw `Error when creating right`
    }

    return await db.sequelize.transaction(async (t) => {
      await db.Role_Right.create({roleId: userIndividualRole.id, rightId: right.id, action: 'w'})

      if (withStudentGroupRole) {
        await db.Role_Right.create({roleId: studentGroupRole.id, rightId: right.id, action: 'r'})
      } else {
        await db.Role_Right.create({roleId: userIndividualRole.id, rightId: right.id, action: 'r'})
      }

      for (const roleRight of additionalRolesWithActions) {
        for (const action in additionalRolesWithActions.actions) {
          await db.Role_Right.create({roleId: roleRight.role.id, rightId: right.id, action})
        }
      }

      const entity = await db[modelName].create(
        {...data, rightId: right.id},
        {transaction: t}
      )

      await transactionCb(t, user, entity)

      return entity
    })
  }
}

module.exports = RightController
