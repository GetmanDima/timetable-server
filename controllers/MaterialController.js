const {Op} = require("sequelize");
const db = require("../models")
const RightController = require("./RightController");

class MaterialController extends RightController {
  static async getAll(req, res) {
    const limit = req.query['limit'] || 50
    const offset = req.query['offset'] || 0

    try {
      const data = {
        include: [
          RightController._includeRightsCheck(req.user, ['r']),
          {
            model: db.Subject
          }
        ],
        limit,
        offset,
        attributes: {
          exclude: ['rightId']
        },
      }

      const {count, rows: materials} = await db.Material.findAndCountAll(data)

      res.header("x-total-count", count).json(materials)
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
          include: [
            {
              model: db.Subject
            },
            {
              model: db.File,
              attributes: {
                exclude: ['path']
              }
            }
          ]
        }
      )

      res.json(material)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const user = req.user
    const name = req.body['name']
    const content = req.body['content']
    const fileIds = req.body['files']
    let target = req.body['target']

    if (!req.user.groupId || req.user.type !== "leader" || !target) {
      target = "personal"
    }

    const data = {name, content, userId: user.id}

    if (target === "group") {
      data.groupId = user.groupId
    }

    try {
      const files = await db.File.findAll({
        where: {
          id: {
            [Op.in]: fileIds
          },
          userId: req.user.id
        }
      })

      const material = await super._createWithRights(
        req.user,
        'Material',
        data,
        target === "group"
      )

      await material.setFiles(files)

      res.header({Location: `/materials/${material.id}`}).sendStatus(201)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const name = req.body['name']
    const content = req.body['content']
    const fileIds = req.body.files

    const where = {userId: req.user.id}

    if (fileIds) {
      where.id = {
        [Op.in]: fileIds
      }
    }

    try {
      const files = await db.File.findAll({where})

      await req.Material.update({name, content})
      await req.Material.setFiles(files)

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    try {
      await req.Material.destroy()

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = MaterialController
