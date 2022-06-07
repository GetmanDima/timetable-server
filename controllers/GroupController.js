const {Op, Sequelize} = require("sequelize");
const crypto = require("crypto");
const db = require("../models")
const RightController = require("./RightController");

class GroupController extends RightController {
  static async getAllByUniversityId(req, res) {
    const universityId = req.params['universityId']
    const limit = req.query['limit'] || 50
    const offset = req.query['offset'] || 0
    const search = req.query['search']
    const parsed = req.query['parsed']

    const where = {universityId}

    if (parsed !== undefined) {
      where.rightId = {
        [parseInt(parsed) ? Op.in : Op.notIn]: Sequelize.literal('(SELECT "rightId" FROM "ParsedData")')
      }
    }

    try {
      const {count, rows: groups} = await super._getAllWithRightsCheck(
        req.user,
        'Group',
        limit,
        offset,
        {
          search,
          where
        }
      )

      res.header("x-total-count", count).json(groups)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const groupId = req.params["groupId"]
    try {
      const group = await db.Group.findByPk(groupId, {attributes: {exclude: ['rightId', 'creationType']}})

      res.json(group)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async getIdentifier(req, res) {
    const groupId = req.params["groupId"]

    try {
      const identifier = await db.GroupIdentifier.findOne({where: {groupId}})

      res.json(identifier)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const universityId = req.params['universityId']
    const name = req.body['name']
    const fullName = req.body['fullName']
    const courseNumber = req.body['courseNumber']
    const admissionYear = req.body['admissionYear']

    try {
      const group = await super._createWithRights(
        req.user,
        'Group',
        {name, fullName, courseNumber, admissionYear, creationType: "custom", universityId},
        false,
        [],
        async (transaction, user, group) => {
          req.user.groupId = group.id
          req.user.universityId = group.universityId
          req.user.save({transaction})
          const groupRole = await db.Role.create({name: `student_group_${group.id}`}, {transaction})
          const universityRole = await db.Role.create({name: `student_university_${group.universityId}`}, {transaction})
          await req.user.addRoles([groupRole, universityRole], {transaction})
          await db.Role_Right.create({roleId: groupRole.id, rightId: group.rightId, action: 'r'}, {transaction})
          await db.Role_Right.create({roleId: universityRole.id, rightId: group.rightId, action: 'r'}, {transaction})

          for (let i = 0; i < 5; i++) {
            const identifier = crypto.randomBytes(8).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
            const existIdentifier = await db.GroupIdentifier.findOne({where: {identifier}})

            if (existIdentifier) {
              if (i === 4) {
                throw new Error("5 attempts were used when selecting an identifier")
              }
            } else {
              await db.GroupIdentifier.create({identifier, groupId: group.id}, {transaction})
              break
            }
          }
        }
      )

      res.header({Location: `/groups/${group.id}`}).sendStatus(201)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const name = req.body['name']
    const fullName = req.body['fullName']
    const courseNumber = req.body['courseNumber']
    const admissionYear = req.body['admissionYear']

    try {
      await req.Group.update(
        {name, fullName, courseNumber, admissionYear}
      )

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = GroupController
