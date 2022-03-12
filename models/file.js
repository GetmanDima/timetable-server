'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Material, {through: models.Material_File, foreignKey: "fileId"})
    }
  }
  File.init({
    url: DataTypes.STRING,
    path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'File',
  });
  return File;
};