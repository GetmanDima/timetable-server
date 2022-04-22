const db = require("../models")
const RightController = require("./RightController");

class EventController extends RightController {
  static async getAll(req, res) {
    const limit = req.query['limit'] || 50
    const offset = req.query['offset'] || 0

    try {
      const {count, rows: events} = await super._getAllWithRightsCheck(req.user, 'Event', limit, offset)

      res.header("x-total-count", count).json(events)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async getOne(req, res) {
    const eventId = req.params["eventId"]

    try {
      const event = await db.Event.findByPk(
        eventId,
        {attributes: {exclude: ['rightId']}}
      )

      res.json(event)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async create(req, res) {
    const name = req.body['name']
    const content = req.body['content']
    const activeFromDate = req.body['activeFromDate']
    const activeToDate = req.body['activeToDate']
    const user = req.user

    try {
      const event = await super._createWithRights(
        req.user,
        'Event',
        {name, content, activeFromDate, activeToDate, groupId: user.groupId},
        true
      )

      res.header({Location: `/events/${event.id}`}).sendStatus(201)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async update(req, res) {
    const name = req.body['name']
    const content = req.body['content']
    const activeFromDate = req.body['activeFromDate']
    const activeToDate = req.body['activeToDate']

    try {
      await req.Event.update({name, content, activeFromDate, activeToDate})

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async delete(req, res) {
    try {
      await req.Event.destroy()

      res.sendStatus(200)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = EventController
