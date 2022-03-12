'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Faculty, {foreignKey: "facultyId"})
      this.hasMany(models.Direction, {foreignKey: 'departmentId'})
      this.belongsToMany(models.Role, {through: models.Department_RoleRight, foreignKey: "departmentId"})
    }
  }
  Department.init({
    name: DataTypes.STRING,
    fullName: DataTypes.STRING,
    facultyId: DataTypes.INTEGER
  }, {
    sequelize,
  });
  return Department;
};