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
      'Faculties_RoleRights',
      [
        {roleId: 5, facultyId: 1, write: true, read: true, createdAt: new Date(), updatedAt: new Date()},
        {roleId: 6, facultyId: 1, write: false, read: true, createdAt: new Date(), updatedAt: new Date()}
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
    await queryInterface.bulkDelete('Faculties_RoleRights', null, {});
  }
};
