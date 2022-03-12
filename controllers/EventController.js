const db = require("../models")
const {Op} = require("sequelize");

class EventController {
  static async getAllByGroupId(req, res) {
    const groupId = req.params["groupId"]
    const activeFromDate = req.query["activeFromDate"]
    const activeToDate = req.query["activeToDate"]
    const limit = req.query["limit"] || 10
    const offset = req.query["offset"] || 0

    const filter = {groupId}

    console.log(activeFromDate)
    console.log(activeToDate)

    if (activeFromDate && activeToDate) {
      filter[Op.and] = [
        {activeFromDate: {[Op.gte]: activeFromDate}},
        {activeToDate: {[Op.lte]: activeToDate}}
      ]
    } else if (activeFromDate) {
      filter.activeFromDate = {
        [Op.gte]: activeFromDate
      }
    } else if (activeToDate) {
      filter.activeToDate = {
        [Op.lte]: activeToDate
      }
    }

    try {
      const events = await db.Event.findAll({
        limit,
        offset,
        where: filter,
      })

      res.json(events)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const eventId = req.params["eventId"]

    try {
      const event = await db.Event.findByPk(
        eventId,
        {where: {groupId: req.user.groupId}}
      )

      if (!event) {
        res.sendStatus(403)
      }

      res.json(event)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const groupId = req.params['groupId']
    const name = req.body['name']
    const content = req.body['content']
    const activeFromDate = req.body['activeFromDate']
    const activeToDate = req.body['activeToDate']

    try {
      const event = await db.Event.create({
        name, content, activeFromDate, activeToDate, groupId
      })

      res.header({Location: `/events/${event.id}`}).sendStatus(201)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const eventId = req.params['eventId']
    const name = req.body['name']
    const content = req.body['content']
    const activeFromDate = req.body['activeFromDate']
    const activeToDate = req.body['activeToDate']

    try {
      await db.Event.update(
        {name, content, activeFromDate, activeToDate},
        {where: {id: eventId, groupId: req.user.groupId}}
      )

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    const eventId = req.params['eventId']

    try {
      await db.Event.destroy(
        {where: {id: eventId}}
      )

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = EventController