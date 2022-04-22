const db = require("../models");
const RightController = require("./RightController");

class TimetableController extends RightController {
  static async getAll(req, res) {
    const limit = req.query['limit'] || 50
    const offset = req.query['offset'] || 0
    const search = req.query['search']

    try {
      const timetables = await super._getAllWithRightsCheck(
        req.user,
        'Timetable',
        limit,
        offset,
        {search}
      )

      res.json(timetables)
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
    const lessons = req.query['lessons']
    let lessonInclude = {}

    if (lessons) {
      lessonInclude = {
        include: {
          model: db.TimetableLesson,
          attributes: {
            exclude: ['classTimeId', 'subjectId', 'teacherId', 'campusId']
          },
          include: [
            {model: db.ClassTime},
            {model: db.Teacher},
            {model: db.Subject},
            {model: db.Campus}
          ]
        },
      }
    }

    try {
      const timetable = await db.Timetable.findByPk(
        timetableId,
        {
          attributes: {
            exclude: ['rightId', 'creationType']
          },
          ...lessonInclude
        },
      )

      res.json(timetable)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const name = req.body['name']
    let personal = req.body['personal']

    if (req.user.type !== "leader") {
      personal = true
    }

    try {
      const timetable = await super._createWithRights(
        req.user, 'Timetable',
        {name, creationType: "custom"},
        !personal
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
