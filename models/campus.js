'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Campus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.University, {foreignKey: "universityId"})
      this.belongsToMany(models.Role, {through: models.Campus_RoleRight, foreignKey: "campusId"})
      this.hasMany(models.TimetableDay, {foreignKey: "campusId"})
    }
  }
  Campus.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    universityId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Campus',
  });
  return Campus;
};