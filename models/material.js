'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {foreignKey: 'userId'})
      this.belongsTo(models.Group, {foreignKey: 'groupId'})
      this.belongsTo(models.Subject, {foreignKey: 'subjectId'})
      this.belongsTo(models.Right, {foreignKey: 'rightId'})
      this.hasMany(models.File, {foreignKey: "materialId"})
    }
  }
  Material.init({
    name: DataTypes.STRING,
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    subjectId: DataTypes.INTEGER,
    rightId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Material',
  });
  return Material;
};
