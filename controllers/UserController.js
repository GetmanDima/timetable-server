const db = require("../models")
const {hashPassword} = require("../helpers")

class UserController {
  static getOne(req, res) {
    const userId = req.params['userId']

    db.User.findByPk(userId, {
      attributes: {
        exclude: ['password']
      }
    })
      .then(r => res.json(r))
      .catch(_ => res.sendStatus(500))
  }

  static update(req, res) {
    const email = req.body['email']
    const password = req.body['password']
    const firstName = req.body['firstName']
    const lastName = req.body['lastName']

    const newValues = {
      email, firstName, lastName
    }

    if (password) {
      newValues.password = hashPassword(password)
    }

    req.user.update(newValues)
      .then(_ => res.sendStatus(200))
      .catch(_ => res.sendStatus(500))
  }
}

module.exports = UserController
