const db = require("../models")
const RightController = require("./RightController");
const {Op} = require("sequelize");

class TeacherController extends RightController {
  static async getAllByUniversityId(req, res) {
    const universityId = req.params['universityId']

    try {
      const teachers = await db.Teacher.findAll({
        where: {universityId},
        include: super._includeRightsCheck(req.user, {read: true}),
        attributes: ['id', 'name']
      })

      res.json(teachers)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const teacherId = req.params['teacherId']

    try {
      const teacher = await db.Teacher.findByPk(
        teacherId,
        {
          include: super._includeRightsCheck(req.user, {read: true}),
          attributes: ['id', 'name']
        }
      )

      res.json(teacher)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const universityId = req.params['universityId']
    const name = req.body['name']
    const user = req.user

    try {
      const readerRole = (await user.getRoles({
        where: {
          name: {
            [Op.startsWith]: 'student_university_',
          }
        }
      }))[0]

      if (!readerRole) {
        return res.sendStatus(500)
      }

      const teacher = await super._createWithRights(
        req.user,
        'Teacher',
        {name, universityId},
        false,
        [{role: readerRole, rights: {read: true, write: false}}]
      )

      res.header({Location: `/teachers/${teacher.id}`}).sendStatus(201)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const teacherId = req.params['teacherId']
    const name = req.body['name']

    try {
      await db.Teacher.update(
        {name},
        {where: {id: teacherId}}
      )

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    const teacherId = req.params['teacherId']

    try {
      await db.Teacher.destroy({where: {id: teacherId}})

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = TeacherController