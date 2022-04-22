const db = require("../models");
const RightController = require("./RightController");
const {Op, Sequelize} = require("sequelize");

class UniversityController extends RightController {
  static async getAll(req, res) {
    const limit = req.query['limit'] || 50
    const offset = req.query['offset'] || 0
    const search = req.query['search']
    const parsed = parseInt(req.query['parsed'])

    try {
      const {count, rows: universities} = await super._getAllWithRightsCheck(
        req.user,
        'University',
        limit,
        offset,
        {
          search,
          where: {
            rightId: {
              [parsed ? Op.in : Op.notIn]: Sequelize.literal('(SELECT "rightId" FROM "ParsedData")')
            },
          },
          order: ['name']
        },
      )

      res.header("x-total-count", count).json(universities)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const universityId = req.params['universityId']

    try {
      const university = await db.University.findByPk(universityId, {
        attributes: {
          exclude: ['rightId']
        },
      })

      res.json(university)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const name = req.body['name']
    const fullName = req.body['fullName']
    const address = req.body['address']

    try {
      const university = await super._createWithRights(
        req.user, 'University',
        {name, fullName, address},
        false
      )
      res.header({Location: `/universities/${university.id}`}).sendStatus(201)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const name = req.body['name']
    const fullName = req.body['fullName']
    const address = req.body['address']

    try {
      await req.University.update(
        {name, fullName, address}
      )

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = UniversityController
