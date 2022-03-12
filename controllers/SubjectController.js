const db = require("../models")
const RightController = require("./RightController");
const {Op} = require("sequelize");

class SubjectController extends RightController {
  static async getAllByUniversityId(req, res) {
    const universityId = req.params['universityId']

    try {
      const subjects = await db.Subject.findAll({
        include: {
          model: db.Role,
          where: {
            name: `student_university_${universityId}`
          },
          required: true,
          attributes: []
        },
        attributes: ['id', 'name']
      })

      res.json(subjects)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const subjectId = req.params['subjectId']

    try {
      const subject = await db.Subject.findByPk(subjectId)

      res.json(subject)
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
          name: `student_university_${universityId}`,
        }
      }))[0]

      if (!readerRole) {
        return res.sendStatus(500)
      }

      const subject = await super._createWithRights(
        req.user,
        'Subject',
        {name},
        false,
        [{role: readerRole, rights: {read: true, write: false}}]
      )

      res.header({Location: `/subjects/${subject.id}`}).sendStatus(201)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const subjectId = req.params['subjectId']
    const name = req.body['name']

    try {
      await db.Subject.update(
        {name},
        {where: {id: subjectId}}
      )

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    const subjectId = req.params['subjectId']

    try {
      await db.Subject.destroy({where: {id: subjectId}})

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = SubjectController