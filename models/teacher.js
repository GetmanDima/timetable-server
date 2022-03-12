'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.University, {foreignKey: 'universityId'})
      this.belongsToMany(models.Role, {through: models.Teacher_RoleRight, foreignKey: "teacherId"})
      this.hasMany(models.TimetableDay, {foreignKey: "teacherId"})
    }
  }
  Teacher.init({
    name: DataTypes.STRING,
    universityId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Teacher',
  });
  return Teacher;
};