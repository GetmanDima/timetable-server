const db = require("../models");

class TimetableDayController {
  static async getAllByTimetableId(req, res) {
    const timetableId = req.params['timetableId']
    const limit = req.query['limit'] || 50
    const offset = req.query['offset'] || 0

    try {
      const days = await db.TimetableDay.findAll({
        where: {timetableId},
        limit,
        offset
      })

      res.json(days)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const timetableDayId = req.params['timetableDayId']
    const timetableId = parseInt(req.params['timetableId'])

    try {
      const day = await db.TimetableDay.findByPk(timetableDayId)

      if (!day || day.timetableId !== timetableId) {
        return res.sendStatus(404)
      }

      res.json(day)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const timetableId = req.params['timetableId']
    const weekDay = req.body['weekDay']
    const weekType = req.body['weekType']
    const format = req.body['format']
    const room = req.body['room']
    const classType = req.body['classType']
    const activeFromDate = req.body['activeFromDate']
    const activeToDate = req.body['activeToDate']
    const classTimeId = req.body['classTimeId']
    const subjectId = req.body['subjectId']
    const teacherId = req.body['teacherId']
    const campusId = req.body['campusId']

    try {
      const timetableDay = await db.TimetableDay.create({
        weekDay, weekType, format, room, classType, activeFromDate, activeToDate,
        classTimeId, subjectId, teacherId, campusId, timetableId
      })

      res.header({Location: `/timetable-days/${timetableDay.id}`}).sendStatus(201)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const weekDay = req.body['weekDay']
    const weekType = req.body['weekType']
    const format = req.body['format']
    const room = req.body['room']
    const classType = req.body['classType']
    const activeFromDate = req.body['activeFromDate']
    const activeToDate = req.body['activeToDate']
    const classTimeId = req.body['classTimeId']
    const subjectId = req.body['subjectId']
    const teacherId = req.body['teacherId']
    const campusId = req.body['campusId']

    try {
      await req.TimetableDay.update({
        weekDay, weekType, format, room, classType, activeFromDate, activeToDate,
        classTimeId, subjectId, teacherId, campusId
      })

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    try {
      await req.TimetableDay.destroy()

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = TimetableDayController
