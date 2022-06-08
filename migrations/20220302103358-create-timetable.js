'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Timetables', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      groupId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Groups'
        },
        onDelete: "SET NULL"
      },
      rightId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Rights'
        },
      },
      parentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Timetables'
        },
        onDelete: "SET NULL"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Timetables');
  }
};
