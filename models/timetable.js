'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Timetable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Right, {foreignKey: 'rightId'})
      this.belongsTo(models.Group, {foreignKey: 'groupId'})
      this.hasMany(models.WeekType, {foreignKey: "timetableId"})
      this.hasMany(models.ClassTime, {foreignKey: "timetableId"})
      this.hasMany(models.Teacher, {foreignKey: "timetableId"})
      this.hasMany(models.Subject, {foreignKey: "timetableId"})
      this.hasMany(models.TimetableLesson, {foreignKey: 'timetableId'})
    }
  }
  Timetable.init({
    name: DataTypes.STRING,
    groupId: DataTypes.INTEGER,
    rightId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Timetable',
  });
  return Timetable;
};
