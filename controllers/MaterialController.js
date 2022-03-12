const db = require("../models")
const RightController = require("./RightController");
const {Op, where} = require("sequelize");

class MaterialController extends RightController {
  static async getAll(req, res) {
    const groupId = req.params['groupId']
    const subjectId = req.params['subjectId']
    const limit = req.query["limit"] || 10
    const offset = req.query["offset"] || 0

    const where = {}

    if (groupId) {
      where.groupId = groupId
    }

    if (subjectId) {
      where.subjectId = subjectId
    }

    try {
      const materials = await db.Material.findAll({
        limit,
        offset,
        include: super._includeRightsCheck(req.user, {read: true}),
        where
      })

      res.json(materials)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const materialId = req.params["materialId"]

    try {
      const material = await db.Material.findByPk(
        materialId,
        {
          where: {groupId: req.user.groupId},
          include: [
            super._includeRightsCheck(req.user, {read: true}),
            {model: db.File, attributes: ['id', 'path'], through: {attributes: []}}
          ],
        }
      )

      res.json(material)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const subjectId = req.params['subjectId']
    const name = req.body['name']
    const content = req.body['content']
    const access = req.body['access']
    const files = req.files
    const user = req.user

    try {
      let readerRole

      if (access === "group") {
        readerRole = await MaterialController.#getUserGroupRole(req.user)
      } else {
        readerRole = await MaterialController.#getUserUniversityRole(req.user)
      }

      if (!readerRole) {
        return res.sendStatus(500)
      }

      const material = await super._createWithRights(
        req.user,
        'Material',
        {name, content, subjectId, access, groupId: user.groupId},
        false,
        [{role: readerRole, rights: {read: true, write: false}}],
        async (transaction, user, material) => {
          const createdFiles = await db.File.bulkCreate(files.map((file) => {
            return {url: `/uploads/${file.filename}`, path: file.path}
          }), {transaction})
          await material.setFiles(createdFiles, {transaction})
        }
      )

      res.header({Location: `/materials/${material.id}`}).sendStatus(201)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const materialId = req.params['materialId']
    const name = req.body['name']
    const content = req.body['content']
    const access = req.body['access']
    const user = req.user

    try {
      const material = await db.Material.findByPk(materialId, {attributes: ['id', 'access']})

      if (access !== material.access) {
        const userUniversityRole = await MaterialController.#getUserUniversityRole(user)
        const userGroupRole = await MaterialController.#getUserGroupRole(user)

        if (!userUniversityRole || !userGroupRole) {
          return res.sendStatus(500)
        }

        const newReaderRole = access === "group" ? userGroupRole : userUniversityRole

        await db.sequelize.transaction(async (t) => {
          await material.removeRole(
            access === "group" ? userUniversityRole : userGroupRole,
            {transaction: t}
          )
          await material.addRole(
            newReaderRole,
            {through: {read: true, write: false}, transaction: t}
          )
        })
      }

      await db.Material.update(
        {name, content, access},
        {where: {id: materialId, groupId: req.user.groupId}}
      )

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    const materialId = req.params['materialId']

    try {
      const files = await db.File.findAll({
        include: {
          model: db.Material,
          through: {
            where: {materialId}
          },
          attributes: [],
          required: true
        },
        attributes: ['id']
      })

      const fileIds = files.map(_ => _.id)

      await db.sequelize.transaction(async (t) => {
        await db.File.destroy({
          where: {
            id: {
              [Op.in]: fileIds
            }
          },
          transaction: t
        })

        await db.Material.destroy({
          where: {id: materialId},
          transaction: t
        })

        res.sendStatus(200)
      })
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async #getUserGroupRole(user) {
    return (await user.getRoles({
      where: {
        name: `student_group_${user.groupId}`
      }
    }))[0]
  }

  static async #getUserUniversityRole(user) {
    return (await user.getRoles({
      where: {
        name: {
          [Op.startsWith]: 'student_university_',
        }
      }
    }))[0]
  }
}

module.exports = MaterialController