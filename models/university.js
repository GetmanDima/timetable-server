'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class University extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Faculty, {foreignKey: 'universityId'})
      this.hasMany(models.Campus, {foreignKey: 'universityId'})
      this.hasMany(models.Teacher, {foreignKey: 'universityId'})
      this.belongsToMany(models.Role, {through: models.University_RoleRight, foreignKey: "universityId"})
    }
  }
  University.init({
    name: DataTypes.STRING,
    fullName: DataTypes.STRING,
    address: DataTypes.STRING,
  }, {
    sequelize,
  });
  return University;
};