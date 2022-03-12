const db = require("../models")
const {hashPassword} = require("../helpers")

class UserProfileController {
  static getOne(req, res) {
    db.User.findByPk(req.user.id, {
      attributes: {
        exclude: ['password']
      }
    })
      .then(r => res.json(r))
      .catch(r => res.sendStatus(500))
  }

  static updateOne(req, res) {
    const body = req.body

    db.User.update(
      {
        email: body.email,
        password: hashPassword(body.password),
        firstName: body.firstName,
        lastName: body.lastName,
        updatedAt: new Date()
      },
      {where: {id: req.user.id}}
    ).catch(e => {
      console.log(`Sql error. ${e.message}`)
    })

    res.sendStatus(201)
  }
}

module.exports = UserProfileController