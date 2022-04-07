const db = require("../models");
const RightController = require("./RightController");

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
      )

      if (!invite) {
        return res.sendStatus(404)
      }

      if (invite.groupId !== req.user.groupId) {
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
    const groupInviteCode = req.GroupInviteCode
    const code = req.body['code']

    if (groupInviteCode.groupId !== req.user.groupId) {
      return res.sendStatus(403)
    }

    try {
      await groupInviteCode.update(
        {code}
      )

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    const groupInviteCode = req.GroupInviteCode

    if (groupInviteCode.groupId !== req.user.groupId) {
      return res.sendStatus(403)
    }

    try {
      await groupInviteCode.destroy()

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = GroupInviteController
