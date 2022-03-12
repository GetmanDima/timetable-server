const db = require("../models")
const RightController = require("./RightController");

class ClassTimeController extends RightController {
  static async getAllByGroupId(req, res) {
    const groupId = req.params['groupId']

    try {
      const classTimes = await db.ClassTime.findAll({
        where: {groupId},
        attributes: ['id', 'number', 'startTime', 'endTime']
      })

      res.json(classTimes)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const classTimeId = req.params['classTimeId']

    try {
      const classTime = await db.ClassTime.findOne({
        where: {id: classTimeId, groupId: req.user.groupId},
      })

      if (!classTime) {
        return res.sendStatus(403)
      }

      res.json(classTime)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const groupId = req.params['groupId']
    const number = req.body['number']
    const startTime = req.body['startTime']
    const endTime = req.body['endTime']

    try {
      const classTime = await db.ClassTime.create({number, startTime, endTime, groupId})

      res.header({Location: `/class-times/${classTime.id}`}).sendStatus(201)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const classTimeId = req.params['classTimeId']
    const number = req.body['number']
    const startTime = req.body['startTime']
    const endTime = req.body['endTime']

    try {
      await db.ClassTime.update(
        {number, startTime, endTime},
        {where: {id: classTimeId, groupId: req.user.groupId}}
      )

      res.sendStatus(200)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    const classTimeId = req.params['classTimeId']

    await db.ClassTime.destroy({
      where: {id: classTimeId, groupId: req.user.groupId},
    })

    return res.sendStatus(200)
  }
}

module.exports = ClassTimeController