const db = require("../models")
const RightController = require("./RightController");

class ClassTimeController extends RightController {
  static async getAllByTimetableId(req, res) {
    const timetableId = req.params['timetableId']
    const limit = req.query['limit'] || 50
    const offset = req.query['offset'] || 0

    try {
      const classTimes = await db.ClassTime.findAll({
        where: {timetableId},
        limit,
        offset
      })

      res.json(classTimes)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const classTimeId = req.params['classTimeId']
    const timetableId = parseInt(req.params['timetableId'])

    try {
      const classTime = await db.ClassTime.findByPk(classTimeId)

      if (!classTime || classTime.timetableId !== timetableId) {
        return res.sendStatus(404)
      }

      res.json(classTime)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const timetableId = req.params['timetableId']
    const number = req.body['number']
    const startTime = req.body['startTime']
    const endTime = req.body['endTime']

    try {
      const classTime = await db.ClassTime.create({number, startTime, endTime, timetableId})

      res.header({Location: `/class-times/${classTime.id}`}).sendStatus(201)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const number = req.body['number']
    const startTime = req.body['startTime']
    const endTime = req.body['endTime']

    try {
      await req.ClassTime.update(
        {number, startTime, endTime}
      )

      res.sendStatus(200)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    await req.ClassTime.destroy()

    return res.sendStatus(200)
  }
}

module.exports = ClassTimeController
