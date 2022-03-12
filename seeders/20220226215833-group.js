'use strict';
const {faker} = require("@faker-js/faker");

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Groups',
      [
        {
          name: faker.random.alpha({count: 3, upcase: true}) + faker.date.past(4).getFullYear(),
          courseNumber: faker.datatype.number({min: 1, max: 4}),
          admissionYear: faker.date.past(4).getFullYear(),
          directionId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Groups', null, {});
  }
};
