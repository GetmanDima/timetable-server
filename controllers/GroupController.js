const db = require("../models")
const RightController = require("./RightController");

class GroupController extends RightController {
  static async getOne(req, res) {
    const groupId = parseInt(req.params["groupId"])

    if (req.user.groupId !== groupId) {
      return res.sendStatus(403)
    }

    try {
      const group = await db.Group.findByPk(groupId, {
        attributes: {
          exclude: ['directionId', 'createdAt', 'updatedAt']
        },
        include: [
          {
            model: db.Direction,
            attributes: ['id', 'name', 'fullName'],
            include: {
              model: db.Department,
              attributes: ['id', 'name', 'fullName'],
              include: {
                model: db.Faculty,
                attributes: ['id', 'name', 'fullName'],
                include: {
                  model: db.University,
                  attributes: ['id', 'name', 'fullName'],
                }
              }
            }
          }
        ]
      })
      res.json(group)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const directionId = req.params['directionId']
    const name = req.body['name']
    const courseNumber = req.body['courseNumber']
    const admissionYear = req.body['admissionYear']

    try {
      const direction = await db.Direction.findByPk(
        directionId,
        {include: super._includeRightsCheck(req.user, {write: true})}
      )

      if (!direction) {
        return res.sendStatus(403)
      }

      const group = await super._createWithRights(
        req.user,
        'Group',
        {name, courseNumber, admissionYear, directionId},
        true,
        [],
        async (transaction, user, group) => {
          user.groupId = group.id
          await user.save({transaction})
        }
      )

      res.header({Location: `/groups/${group.id}`}).sendStatus(201)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const groupId = req.params['groupId']
    const name = req.body['name']
    const courseNumber = req.body['courseNumber']
    const admissionYear = req.body['admissionYear']

    try {
      await db.Group.update(
        {name, courseNumber, admissionYear},
        {where: {id: groupId}}
      )

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = GroupController