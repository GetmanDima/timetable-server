'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.University, {foreignKey: "universityId"})
      this.belongsTo(models.Right, {foreignKey: "rightId"})
      this.hasMany(models.User, {foreignKey: "groupId"})
      this.hasMany(models.GroupInviteCode, {foreignKey: "groupId"})
      this.hasMany(models.Material, {foreignKey: "groupId"})
    }
  }
  Group.init({
    name: DataTypes.STRING,
    fullName: DataTypes.STRING,
    courseNumber: DataTypes.INTEGER,
    admissionYear: DataTypes.INTEGER,
    creationType: DataTypes.STRING,
    universityId: DataTypes.INTEGER,
    rightId: DataTypes.INTEGER
  }, {
    sequelize,
  });
  return Group;
};
