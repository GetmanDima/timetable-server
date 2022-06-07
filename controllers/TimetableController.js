const db = require("../models");
const RightController = require("./RightController");
const {Op, Sequelize} = require("sequelize");

class TimetableController extends RightController {
  static async getAll(req, res) {
    const limit = req.query['limit'] || 50
    const offset = req.query['offset'] || 0
    const search = req.query['search']
    const parsed = req.query['parsed']

    let where = {}

    if (parsed !== undefined) {
      where = {
        rightId: {
          [parseInt(parsed) ? Op.in : Op.notIn]: Sequelize.literal('(SELECT "rightId" FROM "ParsedData")')
        }
      }
    }

    try {
      const {count, rows: timetables} = await super._getAllWithRightsCheck(
        req.user,
        'Timetable',
        limit,
        offset,
        {
          search,
          where,
        }
      )

      res.header("x-total-count", count).json(timetables)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getAllByGroupId(req, res) {
    const groupId = req.params['groupId']
    const limit = req.query['limit'] || 50
    const offset = req.query['offset'] || 0
    const search = req.query['search']

    try {
      const {count, rows: timetables} = await super._getAllWithRightsCheck(
        req.user,
        'Timetable',
        limit,
        offset,
        {
          search,
          where: {groupId: groupId}
        }
      )

      res.header("x-total-count", count).json(timetables)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const timetableId = req.params['timetableId']
    const jsonQueryIncludes = req.query['include']
    let includes = []

    if (jsonQueryIncludes) {
      const queryIncludes = JSON.parse(jsonQueryIncludes)
      const modelNames = ['WeekType', 'ClassTime', 'Teacher', 'Subject']
      includes = modelNames
        .filter(modelName => queryIncludes.find((include) => include === modelName))
        .map(modelName => ({
          model: db[modelName],
          separate: true,
        }))
    }

    try {
      const timetable = await db.Timetable.findByPk(
        timetableId,
        {
          attributes: {
            exclude: ['rightId']
          },
          include: includes
        },
      )

      res.json(timetable)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const name = req.body['name']
    let target = req.body['target']

    if (!req.user.groupId || req.user.type !== "leader" || !target) {
      target = "personal"
    }

    let data = {name}

    if (target === "group") {
      data.groupId = req.user.groupId
    }

    try {
      const timetable = await super._createWithRights(
        req.user, 'Timetable',
        data,
        target !== "personal",
      )

      res.header({Location: `/timetables/${timetable.id}`}).sendStatus(201)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const name = req.body['name']

    try {
      await req.Timetable.update(
        {name},
      )

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    try {
      await req.Timetable.destroy()

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = TimetableController
