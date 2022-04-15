const db = require("../models")
const RightController = require("./RightController");

class TeacherController extends RightController {
  static async getAllByTimetableId(req, res) {
    const timetableId = req.params['timetableId']
    const limit = req.query['limit'] || 50
    const offset = req.query['offset'] || 0

    try {
      const teachers = await db.Teacher.findAll({
        where: {timetableId},
        limit,
        offset
      })

      res.json(teachers)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const teacherId = req.params['teacherId']
    const timetableId = parseInt(req.params['timetableId'])

    try {
      const teacher = await db.Teacher.findByPk(teacherId)

      if (!teacher || teacher.timetableId !== timetableId) {
        return res.sendStatus(404)
      }

      res.json(teacher)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const timetableId = req.params['timetableId']
    const name = req.body['name']

    try {
      const teacher = await db.Teacher.create({name, timetableId})

      res.header({Location: `/timetables/${timetableId}/teachers/${teacher.id}`}).sendStatus(201)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const name = req.body['name']

    try {
      await req.Teacher.update(
        {name}
      )

      res.sendStatus(200)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    try {
      await req.Teacher.destroy()

      return res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = TeacherController
