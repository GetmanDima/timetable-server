'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TimetableDays', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      weekDay: {
        allowNull: false,
        type: Sequelize.STRING
      },
      format: {
        type: Sequelize.STRING
      },
      classNumber: {
        type: Sequelize.STRING
      },
      classTimeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'ClassTimes'
        },
      },
      subjectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Subjects'
        },
      },
      teacherId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Teachers'
        },
      },
      campusId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Campuses'
        },
      },
      timetableId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Timetables'
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
    await queryInterface.dropTable('TimetableDays');
  }
};