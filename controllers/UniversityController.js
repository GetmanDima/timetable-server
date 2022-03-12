const db = require("../models");
const RightController = require("./RightController");

class UniversityController extends RightController {
  static async getAll(req, res) {
    try {
      const universities = await db.University.findAll({
        include: super._includeRightsCheck(req.user, {read: true}),
        attributes: ['id', 'name', 'fullName', 'address']
      })

      res.json(universities)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const universityId = req.params['universityId']

    try {
      const university = await db.University.findByPk(universityId, {
        include: super._includeRightsCheck(req.user, {read: true}),
        attributes: ['id', 'name', 'fullName', 'address']
      })

      res.json(university)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const name = req.body['name']
    const fullName = req.body['fullName']
    const address = req.body['address']

    try {
      const university = await super._createWithRights(
        req.user, 'University',
        {name, fullName, address}
      )
      res.header({Location: `/universities/${university.id}`}).sendStatus(201)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const universityId = req.params['universityId']
    const name = req.body['name']
    const fullName = req.body['fullName']
    const address = req.body['address']

    try {
      await db.University.update(
        {name, fullName, address},
        {where: {id: universityId}}
      )

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = UniversityController