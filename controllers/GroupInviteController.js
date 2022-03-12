const RightController = require("./RightController");
const {Op} = require("sequelize");
const db = require("../models");

class GroupInviteController extends RightController {
  static async getAllByGroupId(req, res) {
    const groupId = req.params["groupId"]

    try {
      const invites = await db.GroupInviteCode.findAll({where: {groupId}})

      res.json(invites)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const groupInviteId = req.params["groupInviteId"]

    try {
      const invite = await db.GroupInviteCode.findByPk(
        groupInviteId,
        {where: {groupId: req.user.groupId}}
      )

      if (!invite) {
        return res.sendStatus(403)
      }

      res.json(invite)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const groupId = req.params['groupId']
    const code = req.body['code']

    try {
      const groupInviteCode = await db.GroupInviteCode.create({code, groupId})

      res.header({Location: `/invite-codes/${groupInviteCode.id}`}).sendStatus(201)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const groupInviteId = req.params['groupInviteId']
    const code = req.body['code']

    try {
      await db.GroupInviteCode.update(
        {code},
        {where: {id: groupInviteId}}
      )

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    const groupInviteId = req.params['groupInviteId']

    try {
      await db.GroupInviteCode.destroy(
        {where: {id: groupInviteId}}
      )

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = GroupInviteController