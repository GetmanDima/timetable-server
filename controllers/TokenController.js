const jwt = require("jsonwebtoken");
const db = require("../models")
const {generateAccessToken, generateRefreshToken,} = require("../helpers")

class TokenController {
  static update(refreshTokenInBody) {
    return async (req, res) => {
      let refreshToken

      if (refreshTokenInBody) {
        refreshToken = req.body['refreshToken']
      } else {
        refreshToken = req.cookies.refreshToken;
      }

      try {
        const dbRefreshToken = await db.Token.findOne({where: {token: refreshToken}})

        if (!dbRefreshToken) {
          return res.sendStatus(401)
        }

        const data = jwt.verify(refreshToken, process.env.TOKEN_SECRET, (err, data) => {
          if (err) {
            return null;
          }

          return data;
        })

        if (!data || !data.user) {
          return res.sendStatus(401)
        }

        const user = await db.User.findByPk(data.user.id)

        if (!user) {
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

        const newAccessToken = generateAccessToken(payload)
        const newRefreshToken = generateRefreshToken(payload)

        await db.Token.destroy({where: {userId: data.user.id}})
        await db.Token.create({token: newRefreshToken, userId: data.user.id})

        if (refreshTokenInBody) {
          res.json({accessToken: newAccessToken, refreshToken: newRefreshToken})
        } else {
          res.cookie('refreshToken', newRefreshToken, {
            path: '/',
            httpOnly: true,
            maxAge: 1000 * 3600 * 24 * 29,
            sameSite: "lax"
          })

          res.json({accessToken: newAccessToken})
        }
      } catch (e) {
        res.sendStatus(500)
      }
    }
  }
}

module.exports = TokenController
