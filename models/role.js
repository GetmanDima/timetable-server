'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.User, {through: models.User_Role, foreignKey: "roleId"})
      this.belongsToMany(models.University, {through: models.University_RoleRight, foreignKey: "roleId"})
      this.belongsToMany(models.Faculty, {through: models.Faculty_RoleRight, foreignKey: "roleId"})
      this.belongsToMany(models.Department, {through: models.Department_RoleRight, foreignKey: "roleId"})
      this.belongsToMany(models.Direction, {through: models.Direction_RoleRight, foreignKey: "roleId"})
      this.belongsToMany(models.Campus, {through: models.Campus_RoleRight, foreignKey: "roleId"})
      this.belongsToMany(models.Subject, {through: models.Subject_RoleRight, foreignKey: "roleId"})
      this.belongsToMany(models.Teacher, {through: models.Teacher_RoleRight, foreignKey: "roleId"})
      this.belongsToMany(models.Material, {through: models.Material_RoleRight, foreignKey: "roleId"})
    }
  }
  Role.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};