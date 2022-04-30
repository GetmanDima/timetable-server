const db = require("../models")
const RightController = require("./RightController");

class WeekTypeController extends RightController {
  static async getAllByTimetableId(req, res) {
    const timetableId = req.params['timetableId']
    const limit = req.query['limit'] || 50
    const offset = req.query['offset'] || 0

    try {
      const weekTypes = await db.WeekType.findAll({
        where: {timetableId},
        limit,
        offset
      })

      res.json(weekTypes)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const weekTypeId = req.params['weekTypeId']
    const timetableId = parseInt(req.params['timetableId'])

    try {
      const weekType = await db.WeekType.findByPk(weekTypeId)

      if (!weekType || weekType.timetableId !== timetableId) {
        return res.sendStatus(404)
      }

      res.json(weekType)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const timetableId = req.params['timetableId']
    const name = req.body['name']

    try {
      const weekType = await db.WeekType.create({name, timetableId})

      res.header({Location: `/timetables/${timetableId}/week-types/${weekType.id}`}).sendStatus(201)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const name = req.body['name']

    try {
      await req.WeekType.update(
        {name}
      )

      res.sendStatus(200)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    try {
      await req.WeekType.destroy()

      return res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = WeekTypeController
