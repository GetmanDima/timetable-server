'use strict';
const {faker} = require("@faker-js/faker");

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Universities',
  [
          {
            name: faker.random.alpha({count: 5, upcase: true}),
            fullName: faker.lorem.words(5),
            address: faker.address.streetAddress(true),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Universities', null, {});
  }
};
