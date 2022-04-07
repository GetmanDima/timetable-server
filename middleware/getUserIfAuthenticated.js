const jwt = require("jsonwebtoken");
const db = require("../models")

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next()
  }

  const token = authHeader.split(' ')[1];
  const data = jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
    if (err) {
      return null;
    }

    return data;
  })

  if (data && data.user) {
    req.user = await db.User.findByPk(data.user.id, {attributes: ['id', 'type', 'groupId', 'universityId']})
    next()
  } else {
    next()
  }
}
