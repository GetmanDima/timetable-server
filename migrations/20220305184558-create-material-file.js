'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Materials_Files', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      materialId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Materials',
        },
        onDelete: 'CASCADE'
      },
      fileId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Files'
        },
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('Materials_Files');
  }
};