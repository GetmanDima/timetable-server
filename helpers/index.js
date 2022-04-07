const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");

exports.generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.TOKEN_SECRET,
    {expiresIn: process.env.ACCESS_TOKEN_LIFETIME}
  );
}

exports.generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.TOKEN_SECRET,
    {expiresIn: process.env.REFRESH_TOKEN_LIFETIME}
  );
}

exports.hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt)
}

exports.checkPassword = (password, hash) => {
  return bcrypt.compareSync(password, hash)
}

// change relative to absolute url
exports.relToAbsUrl = (url) => {
  if (!url) {
    return url
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  return `${process.env.APP_URL}:${process.env.APP_PORT}${url}`
}

exports.getRoleRightActions = (roleRights) => {
  return roleRights.map((roleRight) => roleRight.action)
}

exports.weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
