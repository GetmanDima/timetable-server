const db = require("../../models");
const UniversityStructureController = require("./UniversityStructureController");

class DepartmentController extends UniversityStructureController {
  static async getAllByFacultyId(req, res) {
    const facultyId = req.params['facultyId']
    const limit = req.query['limit'] || 50
    const offset = req.query['offset'] || 0
    const search = req.query['search']

    try {
      const departments = await db.Department.findAll({
        where: {facultyId, ...super.getSearchCondition(search)},
        include: super._includeRightsCheck(req.user, {read: true}),
        attributes: ['id', 'name', 'fullName'],
        limit: limit,
        offset: offset,
      })

      res.json(departments)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const facultyId = req.params['facultyId']
    const name = req.body['name']
    const fullName = req.body['fullName']

    const faculty = await db.Faculty.findByPk(
      facultyId,
      {include: super._includeRightsCheck(req.user, {write: true})}
    )

    if (!faculty) {
      return res.sendStatus(403)
    }

    const department = await super._createWithRights(req.user, 'Department', {name, fullName, facultyId})

    res.header({Location: `/departments/${department.id}`}).sendStatus(201)
  }
}

module.exports = DepartmentController
