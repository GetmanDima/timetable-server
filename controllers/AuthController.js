const db = require("../models")
const {checkPassword, generateAccessToken, generateRefreshToken, hashPassword} = require("../helpers");

class AuthController {
  static login(refreshTokenInBody) {
    return async (req, res) => {
      const email = req.body.email
      const password = req.body.password

      try {
        const user = await db.User.findOne({where: {email}})

        if (!user || !checkPassword(password, user.password)) {
          return res.sendStatus(401)
        }

        const payload = {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            type: user.type,
            groupId: user.groupId,
            universityId: user.universityId
          }
        }

        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)

        const queryCondition = {where: {userId: user.id}}

        // max 4 refresh tokens per user
        if (await db.Token.count(queryCondition) > 3) {
          const oldestTokenId = await db.Token.min('id', queryCondition)
          await db.Token.destroy({where: {id: oldestTokenId}})
        }

        await db.Token.create({token: refreshToken, userId: user.id})

        if (refreshTokenInBody) {
          res.json({accessToken, refreshToken})
        } else {
          res.cookie('refreshToken', refreshToken, {
            path: '/',
            httpOnly: true,
            maxAge: 1000 * 3600 * 24 * 29,
            sameSite: "lax"
          })

          res.json({accessToken})
        }
      } catch (_) {
        res.sendStatus(500)
      }
    }
  }

  static async registerLeader(req, res) {
    const email = req.body['email']
    const password = req.body['password']
    const firstName = req.body['firstName']
    const lastName = req.body['lastName']

    const passwordHash = hashPassword(password)

    try {
      const allRole = await db.Role.findOne({where: {name: 'all'}})
      const usersRole = await db.Role.findOne({where: {name: 'users'}})

      if (!allRole || !usersRole) {
        return res.sendStatus(500)
      }

      const user = await db.sequelize.transaction(async (t) => {
        const user = await db.User.create({
          email, firstName, lastName, password: passwordHash, type: 'leader'
        }, {transaction: t})

        const userIndividualRole = await db.Role.create({
          name: `user_${user.id}`
        }, {transaction: t})

        await user.setRoles([allRole, usersRole, userIndividualRole], {transaction: t})

        return user
      })

      res.header({Location: `/users/${user.id}`}).sendStatus(201)
    } catch (_) {
      res.sendStatus(500)
    }
  }

  static async registerStudent(req, res) {
    const email = req.body['email']
    const password = req.body['password']
    const firstName = req.body['firstName']
    const lastName = req.body['lastName']
    const identifier = req.body['groupIdentifier']
    const inviteCode = req.body['groupInviteCode']

    const passwordHash = hashPassword(password)

    const groupIdentifier = await db.GroupIdentifier.findOne({where: {identifier}})

    if (!groupIdentifier) {
      return res.sendStatus(400)
    }

    const groupId = groupIdentifier.groupId

    const groupInviteCode = await db.GroupInviteCode.findOne({
      where: {code: inviteCode, groupId},
      include: {
        model: db.Group,
        include: {
          model: db.University
        }
      }
    })

    if (!groupInviteCode) {
      return res.sendStatus(400)
    }

    const universityId = groupInviteCode.Group.University.id

    try {
      const allRole = await db.Role.findOne({where: {name: 'all'}})
      const usersRole = await db.Role.findOne({where: {name: 'users'}})
      const studentGroupRole = await db.Role.findOne({where: {name: `student_group_${groupId}`}})
      const studentUniversityRole = await db.Role.findOne({where: {name: `student_university_${universityId}`}})

      if (!allRole || !usersRole || !studentGroupRole || !studentUniversityRole) {
        return res.sendStatus(500)
      }

      const user = await db.sequelize.transaction(async (t) => {
        const user = await db.User.create({
          email, firstName, lastName, password: passwordHash,
          type: 'student', groupId, universityId
        })

        const userIndividualRole = await db.Role.create({
          name: `user_${user.id}`
        }, {transaction: t})

        await user.setRoles([
          allRole, usersRole, studentGroupRole, studentUniversityRole, userIndividualRole
        ], {transaction: t})

        return user
      })

      res.header({Location: `/users/${user.id}`}).sendStatus(201)
    } catch (_) {
      res.sendStatus(500)
    }
  }
}

module.exports = AuthController
