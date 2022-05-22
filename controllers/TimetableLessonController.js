const db = require("../models");

class TimetableLessonController {
  static async getAllByTimetableId(req, res) {
    const timetableId = req.params['timetableId']
    const weekDay = req.query['weekDay']
    const jsonQueryIncludes = req.query['include']
    const limit = 350 // max 50 (50 * 7 = 350) lessons per day

    const where = {timetableId}

    if (weekDay) {
      where.weekDay = weekDay
    }

    let includes = []

    if (jsonQueryIncludes) {
      const queryIncludes = JSON.parse(jsonQueryIncludes)
      const modelNames = ['WeekType', 'ClassTime', 'Teacher', 'Subject']
      includes = modelNames
        .filter(modelName => queryIncludes.find((include) => include === modelName))
        .map(modelName => ({
          model: db[modelName],
        }))
    }

    try {
      const lessons = await db.TimetableLesson.findAll({
        where,
        include: includes,
        limit,
      })

      res.json(lessons)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const timetableLessonId = req.params['timetableLessonId']
    const timetableId = parseInt(req.params['timetableId'])

    try {
      const lesson = await db.TimetableLesson.findByPk(
        timetableLessonId,
        {
          include: [
            {model: db.ClassTime},
            {model: db.Teacher},
            {model: db.Subject},
            {model: db.Campus}
          ],
        }
      )

      if (!lesson || lesson.timetableId !== timetableId) {
        return res.sendStatus(404)
      }

      res.json(lesson)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const timetableId = req.params['timetableId']
    const weekDay = req.body['weekDay']
    const format = req.body['format']
    const room = req.body['room']
    const classType = req.body['classType']
    const activeFromDate = req.body['activeFromDate']
    const activeToDate = req.body['activeToDate']
    const weekTypeId = req.body['weekTypeId']
    const classTimeId = req.body['classTimeId']
    const subjectId = req.body['subjectId']
    const teacherId = req.body['teacherId']
    const campusId = req.body['campusId']

    try {
      const lesson = await db.TimetableLesson.create({
        weekDay, format, room, classType, activeFromDate, activeToDate,
        weekTypeId, classTimeId, subjectId, teacherId, campusId, timetableId
      })

      res.header({Location: `/timetables/${timetableId}/${lesson.id}`}).sendStatus(201)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const weekDay = req.body['weekDay']
    const format = req.body['format']
    const room = req.body['room']
    const classType = req.body['classType']
    const activeFromDate = req.body['activeFromDate']
    const activeToDate = req.body['activeToDate']
    const weekTypeId = req.body['weekTypeId']
    const classTimeId = req.body['classTimeId']
    const subjectId = req.body['subjectId']
    const teacherId = req.body['teacherId']
    const campusId = req.body['campusId']

    try {
      await req.TimetableLesson.update({
        weekDay, format, room, classType, activeFromDate, activeToDate,
        weekTypeId, classTimeId, subjectId, teacherId, campusId
      })

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    try {
      await req.TimetableLesson.destroy()

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = TimetableLessonController
