'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Material_File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Material_File.init({
    materialId: DataTypes.INTEGER,
    fileId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Material_File',
    tableName: 'Materials_Files'
  });
  return Material_File;
};