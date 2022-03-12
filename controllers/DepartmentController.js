const db = require("../models");
const RightController = require("./RightController");

class DepartmentController extends RightController {
  static async getAllByFacultyId(req, res) {
    const facultyId = req.params['facultyId']

    try {
      const departments = await db.Department.findAll({
        where: {facultyId},
        include: super._includeRightsCheck(req.user, {read: true}),
        attributes: ['id', 'name', 'fullName']
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