'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class University_RoleRight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  University_RoleRight.init({
    roleId: DataTypes.INTEGER,
    universityId: DataTypes.INTEGER,
    read: DataTypes.BOOLEAN,
    write: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'University_RoleRight',
    tableName: 'Universities_RoleRights'
  });
  return University_RoleRight;
};