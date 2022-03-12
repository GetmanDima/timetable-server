'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Faculty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.University, {foreignKey: "universityId"})
      this.hasMany(models.Department, {foreignKey: 'facultyId'})
      this.belongsToMany(models.Role, {through: models.Faculty_RoleRight, foreignKey: "facultyId"})
    }
  }
  Faculty.init({
    name: DataTypes.STRING,
    fullName: DataTypes.STRING,
    universityId: DataTypes.INTEGER
  }, {
    sequelize,
  });
  return Faculty;
};