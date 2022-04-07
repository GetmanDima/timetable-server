const db = require("../models")
const RightController = require("./RightController");
const {Op, where} = require("sequelize");

class MaterialController extends RightController {
  static async getAll(req, res) {
    const limit = req.query['limit'] || 50
    const offset = req.query['offset'] || 0

    try {
      const materials = await super._getAllWithRightsCheck(req.user, 'Material', limit, offset)

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
          include: {
            model: db.File,
            attributes: {
              exclude: ['path']
            }
          }
        }
      )

      res.json(material)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const name = req.body['name']
    const content = req.body['content']
    const files = req.files
    const user = req.user

    try {
      const material = await super._createWithRights(
        req.user,
        'Material',
        {name, content, userId: user.id, groupId: user.groupId},
        true,
        [],
        async (transaction, user, material) => {
          const createdFiles = await db.File.bulkCreate(files.map((file) => {
            return {name: file.filename, path: file.path, url: `/uploads/${file.filename}`}
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
    const name = req.body['name']
    const content = req.body['content']

    try {
      await req.Material.update({name, content})

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    try {
      await db.File.destroy({where: {materialId: req.Material.id}})
      await req.Material.destroy()

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = MaterialController
