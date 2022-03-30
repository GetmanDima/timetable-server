const {Op} = require("sequelize");
const RightController = require("../RightController");


class UniversityStructureController extends RightController {
  static getSearchCondition(search) {
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

module.exports = UniversityStructureController
