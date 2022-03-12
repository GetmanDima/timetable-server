const RightController = require("./RightController");
const db = require("../models");
const {Op} = require("sequelize");

class CampusController extends RightController {
  static async getAllByUniversityId(req, res) {
    const universityId = req.params['universityId']

    try {
      const campuses = await db.Campus.findAll({
        where: {universityId},
        include: super._includeRightsCheck(req.user, {read: true}),
        attributes: ['id', 'name', 'address']
      })

      res.json(campuses)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const campusId = req.params['campusId']

    try {
      const campus = await db.Campus.findByPk(
        campusId,
        {
          include: super._includeRightsCheck(req.user, {read: true}),
          attributes: ['id', 'name', 'address']
        }
      )

      if (!campus) {
        return res.sendStatus(403)
      }

      res.json(campus)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const universityId = req.params['universityId']
    const name = req.body['name']
    const address = req.body['address']
    const user = req.user

    try {
      const university = await db.University.findByPk(
        universityId,
        {include: super._includeRightsCheck(req.user, {write: true})}
      )

      if (!university) {
        return res.sendStatus(403)
      }

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

      const campus = await super._createWithRights(
        req.user,
        'Campus',
        {name, address, universityId},
        false,
        [{role: readerRole, rights: {read: true, write: false}}]
      )

      res.header({Location: `/campuses/${campus.id}`}).sendStatus(201)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const campusId = req.params['campusId']
    const name = req.body['name']
    const address = req.body['address']

    try {
      await db.Campus.update(
        {name, address},
        {where: {id: campusId}}
      )

      res.sendStatus(200)
    } catch(_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    const campusId = req.params['campusId']

    try {
      await db.Campus.destroy({where: {id: campusId}})

      res.sendStatus(200)
    } catch(_) {
      res.sendStatus(500)
    }
  }
}

module.exports = CampusController