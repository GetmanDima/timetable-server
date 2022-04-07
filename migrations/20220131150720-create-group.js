'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Groups', {
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
      fullName: {
        type: Sequelize.STRING
      },
      courseNumber: {
        type: Sequelize.INTEGER
      },
      admissionYear: {
        type: Sequelize.INTEGER
      },
      creationType: {
        type: Sequelize.STRING
      },
      universityId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Universities'
        },
      },
      rightId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Rights'
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Groups');
  }
};
