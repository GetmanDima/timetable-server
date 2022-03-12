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
      'Departments_RoleRights',
      [
        {roleId: 7, departmentId: 1, write: true, read: true, createdAt: new Date(), updatedAt: new Date()},
        {roleId: 8, departmentId: 1, write: false, read: true, createdAt: new Date(), updatedAt: new Date()}
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
    await queryInterface.bulkDelete('Departments_RoleRights', null, {});
  }
};
