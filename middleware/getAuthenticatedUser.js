const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
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
    req.user = data.user
    next()
  } else {
    next()
  }
}