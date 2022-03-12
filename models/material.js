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
      this.belongsTo(models.Subject, {foreignKey: 'groupId'})
      this.belongsTo(models.Subject, {foreignKey: 'subjectId'})
      this.belongsToMany(models.Role, {through: models.Material_RoleRight, foreignKey: "materialId"})
      this.belongsToMany(models.File, {through: models.Material_File, foreignKey: "materialId"})
    }
  }
  Material.init({
    name: DataTypes.STRING,
    content: DataTypes.STRING,
    access: DataTypes.STRING,
    subjectId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Material',
  });
  return Material;
};