'use strict';
const {faker} = require("@faker-js/faker");

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Directions',
      [
        {
          name: faker.random.alpha({count: 3, upcase: true}),
          fullName: faker.lorem.words(3),
          departmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Directions', null, {});
  }
};
