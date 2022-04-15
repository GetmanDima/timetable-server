const db = require("../models")
const RightController = require("./RightController");

class CampusController extends RightController {
  static async getAllByTimetableId(req, res) {
    const timetableId = req.params['timetableId']
    const limit = req.query['limit'] || 50
    const offset = req.query['offset'] || 0

    try {
      const campuses = await db.Campus.findAll({
        where: {timetableId},
        limit,
        offset
      })

      res.json(campuses)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const campusId = req.params['campusId']
    const timetableId = parseInt(req.params['timetableId'])

    try {
      const campus = await db.Campus.findByPk(campusId)

      if (!campus || campus.timetableId !== timetableId) {
        return res.sendStatus(404)
      }

      res.json(campus)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const timetableId = req.params['timetableId']
    const name = req.body['name']
    const address = req.body['address']

    try {
      const campus = await db.Campus.create({name, address, timetableId})

      res.header({Location: `/timetables/${timetableId}/campuses/${campus.id}`}).sendStatus(201)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const name = req.body['name']
    const address = req.body['address']

    try {
      await req.Campus.update(
        {name, address}
      )

      res.sendStatus(200)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    try {
      await req.Campus.destroy()

      return res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = CampusController
