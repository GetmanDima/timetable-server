'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TimetableLessons', {
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
      room: {
        type: Sequelize.STRING
      },
      classType: {
        type: Sequelize.STRING
      },
      activeFromDate: {
        type: Sequelize.DATE
      },
      activeToDate: {
        type: Sequelize.DATE
      },
      weekTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'WeekTypes'
        },
        onDelete: "SET NULL"
      },
      classTimeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ClassTimes'
        },
        onDelete: "SET NULL"
      },
      subjectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Subjects'
        },
        onDelete: "SET NULL"
      },
      teacherId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Teachers'
        },
        onDelete: "SET NULL"
      },
      campusId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Campuses'
        },
        onDelete: "SET NULL"
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
    await queryInterface.dropTable('TimetableLessons');
  }
};
