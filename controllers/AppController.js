const {Op} = require("sequelize");

class AppController {
  static _getSearchCondition(search) {
    return search ? {
      [Op.or]: {
        name: {
          [Op.iLike]: `%${search}%`,
        },
        fullName: {
          [Op.iLike]: `%${search}%`,
        }
      }
    } : {}
  }
}

module.exports = AppController
