const db = require("../models")
const RightController = require("./RightController");

class SubjectController extends RightController {
  static async getAllByTimetableId(req, res) {
    const timetableId = req.params['timetableId']
    const limit = req.query['limit'] || 50
    const offset = req.query['offset'] || 0

    try {
      const subjects = await db.Subject.findAll({
        where: {timetableId},
        limit,
        offset
      })

      res.json(subjects)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const subjectId = req.params['subjectId']
    const timetableId = parseInt(req.params['timetableId'])

    try {
      const subject = await db.Subject.findByPk(subjectId)

      if (!subject || subject.timetableId !== timetableId) {
        return res.sendStatus(404)
      }

      res.json(subject)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const timetableId = req.params['timetableId']
    const name = req.body['name']

    try {
      const subject = await db.Subject.create({name, timetableId})

      res.header({Location: `/timetables/${timetableId}/subjects/${subject.id}`}).sendStatus(201)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const name = req.body['name']

    try {
      await req.Subject.update(
        {name}
      )

      res.sendStatus(200)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    try {
      await req.Subject.destroy()

      return res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = SubjectController
