const db = require("../../models");
const UniversityStructureController = require("./UniversityStructureController");

class FacultyController extends UniversityStructureController {
  static async getAllByUniversityId(req, res) {
    const universityId = req.params['universityId']
    const limit = req.query['limit'] || 50
    const offset = req.query['offset'] || 0
    const search = req.query['search']

    try {
      const faculties = await db.Faculty.findAll({
        where: {universityId, ...super.getSearchCondition(search)},
        include: super._includeRightsCheck(req.user, {read: true}),
        attributes: ['id', 'name', 'fullName'],
        limit: limit,
        offset: offset,
      })

      res.json(faculties)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const facultyId = req.params['facultyId']

    try {
      const faculty = await db.Faculty.findByPk(facultyId, {
        include: super._includeRightsCheck(req.user, {read: true}),
        attributes: ['id', 'name', 'fullName']
      })

      res.json(faculty)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const universityId = req.params['universityId']
    const name = req.body['name']
    const fullName = req.body['fullName']

    const university = await db.University.findByPk(
      universityId,
      {include: super._includeRightsCheck(req.user, {write: true})}
    )

    if (!university) {
      return res.sendStatus(403)
    }

    const faculty = await super._createWithRights(req.user, 'Faculty', {name, fullName, universityId})

    res.header({Location: `/faculties/${faculty.id}`}).sendStatus(201)
  }
}

module.exports = FacultyController
