'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Right, {foreignKey: 'rightId'})
      this.belongsTo(models.Group, {foreignKey: "groupId"})
    }
  }
  Event.init({
    name: DataTypes.STRING,
    content: DataTypes.STRING,
    activeFromDate: DataTypes.DATE,
    activeToDate: DataTypes.DATE,
    groupId: DataTypes.INTEGER,
    rightId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
