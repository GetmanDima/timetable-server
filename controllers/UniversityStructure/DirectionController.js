const db = require("../../models");
const UniversityStructureController = require("./UniversityStructureController");

class DirectionController extends UniversityStructureController {
  static async getAllByDepartmentId(req, res) {
    const departmentId = req.params['departmentId']
    const limit = req.query['limit'] || 50
    const offset = req.query['offset'] || 0
    const search = req.query['search']

    try {
      const directions = await db.Direction.findAll({
        where: {departmentId, ...super.getSearchCondition(search)},
        include: super._includeRightsCheck(req.user, {read: true}),
        attributes: ['id', 'name', 'fullName'],
        limit,
        offset
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
