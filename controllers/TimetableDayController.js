const db = require("../models");

class TimetableDayController {
  static async getAllByTimetableId(req, res) {
    const timetableId = req.params['timetableId']

    const timetable = await db.Timetable.findByPk(timetableId, {attributes: ['groupId']})

    if (timetable.groupId !== req.user.groupId) {
      return res.sendStatus(403)
    }

    try {
      const days = await db.TimetableDay.findAll({
        where: {timetableId}
      })

      res.json(days)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const timetableDayId = req.params['timetableDayId']

    try {
      const day = await db.TimetableDay.findByPk(
        timetableDayId,
        {
          where: {
            include: [{
              model: db.Timetable,
              where: {
                groupId: req.user.groupId
              }
            }]
          }
        }
      )

      if (!day) {
        return res.sendStatus(403)
      }

      res.json(day)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const timetableId = req.params['timetableId']
    const weekDay = req.body['weekDay']
    const format = req.body['format']
    const classNumber = req.body['classNumber']
    const classTimeId = req.body['classTimeId']
    const subjectId = req.body['subjectId']
    const teacherId = req.body['teacherId']
    const campusId = req.body['campusId']

    try {
      const timetable = await db.Timetable.findByPk(timetableId, {attributes: ['groupId']})

      if (timetable.groupId !== req.user.groupId) {
        return res.sendStatus(403)
      }

      const timetableDay = await db.TimetableDay.create({
        weekDay, format, classNumber, classTimeId,
        subjectId, teacherId, campusId, timetableId
      })

      res.header({Location: `/timetable-day/${timetableDay.id}`}).sendStatus(201)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const timetableDayId = req.params['timetableDayId']
    const weekDay = req.body['weekDay']
    const format = req.body['format']
    const classNumber = req.body['classNumber']
    const classTimeId = req.body['classTimeId']
    const subjectId = req.body['subjectId']
    const teacherId = req.body['teacherId']
    const campusId = req.body['campusId']

    try {
      const timetableDay = await db.TimetableDay.findByPk(
        timetableDayId,
        {
          include: {
            model: db.Timetable,
            attributes: ['groupId']
          },
          attributes: []
        }
      )

      if (timetableDay.Timetable.groupId !== req.user.groupId) {
        return res.sendStatus(403)
      }

      await db.TimetableDay.update(
        {
          weekDay, format, classNumber, classTimeId,
          subjectId, teacherId, campusId,
        },
        {
          where: {
            id: timetableDayId,
          }
        }
      )

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    const timetableDayId = req.params['timetableDayId']

    const timetableDay = await db.TimetableDay.findByPk(
      timetableDayId,
      {
        include: {
          model: db.Timetable,
          attributes: ['groupId']
        },
        attributes: []
      }
    )

    if (timetableDay.Timetable.groupId !== req.user.groupId) {
      return res.sendStatus(403)
    }

    try {
      await db.TimetableDay.destroy({
        where: {
          id: timetableDayId,
        }
      })

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = TimetableDayController