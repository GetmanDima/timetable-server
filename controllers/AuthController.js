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
            groupId: user.groupId
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
      const studentRole = await db.Role.findOne({where: {name: 'student'}})
      const leaderRole = await db.Role.findOne({where: {name: 'leader'}})

      if (!studentRole || !leaderRole) {
        return res.sendStatus(500)
      }

      const user = await db.sequelize.transaction(async (t) => {
        const user = await db.User.create({
          email, firstName, lastName, password: passwordHash, type: 'leader'
        }, {transaction: t})

        await user.setRoles([studentRole, leaderRole], {transaction: t})

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
    const inviteCode = req.body['inviteCode']

    const passwordHash = hashPassword(password)

    const groupInviteCode = await db.GroupInviteCode.findOne({
      where: {code: inviteCode},
      include: {
        model: db.Group,
        include: {
          model: db.Direction,
          include: {
            model: db.Department,
            include: {
              model: db.Faculty,
              include: {
                model: db.University
              }
            }
          }
        }
      }
    })

    if (!groupInviteCode) {
      return res.sendStatus(400)
    }

    const userGroup = groupInviteCode.Group
    const userDirection = userGroup.Direction
    const userDepartment = userDirection.Department
    const userFaculty = userDepartment.Faculty
    const userUniversity = userFaculty.University

    try {
      const studentRole = await db.Role.findOne({where: {name: 'student'}})
      const studentGroupRole = await db.Role.findOne({where: {name: `student_group_${userGroup.id}`}})
      const studentDirectionRole = await db.Role.findOne({where: {name: `student_direction_${userDirection.id}`}})
      const studentDepartmentRole = await db.Role.findOne({where: {name: `student_department_${userDepartment.id}`}})
      const studentFacultyRole = await db.Role.findOne({where: {name: `student_faculty_${userFaculty.id}`}})
      const studentUniversityRole = await db.Role.findOne({where: {name: `student_university_${userUniversity.id}`}})

      if (!studentRole || !studentGroupRole
        || !studentDirectionRole || !studentDepartmentRole
        || !studentFacultyRole || !studentUniversityRole) {
        return res.sendStatus(500)
      }

      const user = await db.sequelize.transaction(async (t) => {
        const user = await db.User.create({
          email, firstName, lastName, password: passwordHash,
          type: 'student', groupId: groupInviteCode.Group.id
        })

        await user.setRoles([
          studentRole, studentGroupRole, studentDirectionRole,
          studentDepartmentRole, studentFacultyRole, studentUniversityRole
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
