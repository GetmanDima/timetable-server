const db = require("../models")
const RightController = require("./RightController");
const {Op} = require("sequelize");

class FileController extends RightController {
  static async create(req, res) {
    const reqFile = req.file
    const user = req.user

    try {
      const file = await db.File.create({
        name: reqFile.filename,
        path: reqFile.path,
        url: `/uploads/${reqFile.filename}`,
        userId: user.id
      })

      res.header({Location: `/files/${file.id}`}).sendStatus(201)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    try {
      await req.File.destroy()

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getAllByUserId(req, res) {
    let unused = req.query['unused']

    try {
      const where = {
        userId: req.user.id
      }

      if (unused !== undefined) {
        unused = parseInt(unused)

        if (unused) {
          where.materialId = null
        } else {
          where.materialId = {
            [Op.not]: null
          }
        }
      }

      const {count, rows: files} = await db.File.findAndCountAll({
        where
      })

      res.header("x-total-count", count).json(files)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = FileController
