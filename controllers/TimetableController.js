const db = require("../models");

class TimetableController {
  static async getAllByGroupId(req, res) {
    const groupId = parseInt(req.params['groupId'])

    if (req.user.groupId !== groupId) {
      return res.sendStatus(403)
    }

    try {
      const timetables = await db.Timetable.findAll({
        where: {groupId}
      })

      res.json(timetables)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const timetableId = req.params['timetableId']

    try {
      const timetable = await db.Timetable.findByPk(
        timetableId,
        {
          include: {
            model: db.TimetableDay
          }
        }
      )

      if (timetable.groupId !== req.user.groupId) {
        return res.sendStatus(403)
      }

      res.json(timetable)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const groupId = parseInt(req.params['groupId'])
    const name = req.body['name']

    if (req.user.groupId !== groupId) {
      return res.sendStatus(403)
    }

    try {
      const timetable = await db.Timetable.create({name, groupId})

      res.header({Location: `/timetables/${timetable.id}`}).sendStatus(201)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const timetableId = parseInt(req.params['timetableId'])
    const name = req.body['name']

    try {
      await db.Timetable.update(
        {name},
        {where: {id: timetableId, groupId: req.user.groupId}}
      )

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    const timetableId = parseInt(req.params['timetableId'])

    try {
      await db.Timetable.destroy(
        {where: {id: timetableId, groupId: req.user.groupId}}
      )

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = TimetableController