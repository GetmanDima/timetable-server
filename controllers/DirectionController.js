const db = require("../models");
const RightController = require("./RightController");

class DirectionController extends RightController {
  static async getAllByDepartmentId(req, res) {
    const departmentId = req.params['departmentId']

    try {
      const directions = await db.Direction.findAll({
        where: {departmentId},
        include: super._includeRightsCheck(req.user, {read: true}),
        attributes: ['id', 'name', 'fullName']
      })

      res.json(directions)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const departmentId = req.params['departmentId']
    const name = req.body['name']
    const fullName = req.body['fullName']

    const department = await db.Department.findByPk(
      departmentId,
      {include: super._includeRightsCheck(req.user, {write: true})}
    )

    if (!department) {
      return res.sendStatus(403)
    }

    const direction = await super._createWithRights(req.user, 'Direction', {name, fullName, departmentId})

    res.header({Location: `/directions/${direction.id}`}).sendStatus(201)
  }
}

module.exports = DirectionController