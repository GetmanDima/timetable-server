const checkEntityUserRights = require("../middleware/checkEntityUserRights");

exports.checkChildRouterUserRights = (req, res, next) => {
  req.method === "GET"
    ? checkEntityUserRights('Timetable', 'timetableId', ['r'])(req, res, next)
    : checkEntityUserRights('Timetable', 'timetableId', ['w'])(req, res, next)
}
