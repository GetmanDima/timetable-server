'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Direction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Department, {foreignKey: "departmentId"})
      this.hasMany(models.Group, {foreignKey: 'directionId'})
      this.belongsToMany(models.Role, {through: models.Direction_RoleRight, foreignKey: "directionId"})
    }
  }
  Direction.init({
    name: DataTypes.STRING,
    fullName: DataTypes.STRING,
    departmentId: DataTypes.INTEGER
  }, {
    sequelize,
  });
  return Direction;
};