'use strict';

const {hashPassword} = require("../helpers");
const {faker} = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'Users',
      Array.from({length: 2}).map((_, idx) => {
        const firstName = faker.name.firstName()
        const lastName = faker.name.lastName()

        return {
          firstName: firstName,
          lastName: lastName,
          email: idx === 0 ? 'leader@mail.loc' : 'student@mail.loc',
          password: hashPassword('password'),
          type: idx === 0 ? 'leader' : 'student',
          groupId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
