'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
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
      'Users_Roles',
      [
        {userId: 1, roleId: 1, createdAt: new Date(), updatedAt: new Date()},
        {userId: 1, roleId: 2, createdAt: new Date(), updatedAt: new Date()},
        {userId: 1, roleId: 3, createdAt: new Date(), updatedAt: new Date()},
        {userId: 1, roleId: 4, createdAt: new Date(), updatedAt: new Date()},
        {userId: 1, roleId: 5, createdAt: new Date(), updatedAt: new Date()},
        {userId: 1, roleId: 6, createdAt: new Date(), updatedAt: new Date()},
        {userId: 1, roleId: 7, createdAt: new Date(), updatedAt: new Date()},
        {userId: 1, roleId: 8, createdAt: new Date(), updatedAt: new Date()},
        {userId: 1, roleId: 9, createdAt: new Date(), updatedAt: new Date()},
        {userId: 1, roleId: 10, createdAt: new Date(), updatedAt: new Date()},
        {userId: 1, roleId: 11, createdAt: new Date(), updatedAt: new Date()},
        {userId: 1, roleId: 12, createdAt: new Date(), updatedAt: new Date()},
        {userId: 2, roleId: 1, createdAt: new Date(), updatedAt: new Date()},
        {userId: 2, roleId: 4, createdAt: new Date(), updatedAt: new Date()},
        {userId: 2, roleId: 6, createdAt: new Date(), updatedAt: new Date()},
        {userId: 2, roleId: 8, createdAt: new Date(), updatedAt: new Date()},
        {userId: 2, roleId: 10, createdAt: new Date(), updatedAt: new Date()},
        {userId: 2, roleId: 12, createdAt: new Date(), updatedAt: new Date()},
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users_Roles', null, {});
  }
};
