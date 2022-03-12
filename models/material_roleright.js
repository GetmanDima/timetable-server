'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Material_RoleRight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Material_RoleRight.init({
    roleId: DataTypes.INTEGER,
    materialId: DataTypes.INTEGER,
    read: DataTypes.BOOLEAN,
    write: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Material_RoleRight',
    tableName: 'Materials_RoleRights',
  });
  return Material_RoleRight;
};