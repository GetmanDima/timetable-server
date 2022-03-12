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
      'Roles',
      [
        {name: 'student', createdAt: new Date(), updatedAt: new Date()},
        {name: 'leader', createdAt: new Date(), updatedAt: new Date()},
        {name: 'creator_university_1', createdAt: new Date(), updatedAt: new Date()},
        {name: 'student_university_1', createdAt: new Date(), updatedAt: new Date()},
        {name: 'creator_faculty_1', createdAt: new Date(), updatedAt: new Date()},
        {name: 'student_faculty_1', createdAt: new Date(), updatedAt: new Date()},
        {name: 'creator_department_1', createdAt: new Date(), updatedAt: new Date()},
        {name: 'student_department_1', createdAt: new Date(), updatedAt: new Date()},
        {name: 'creator_direction_1', createdAt: new Date(), updatedAt: new Date()},
        {name: 'student_direction_1', createdAt: new Date(), updatedAt: new Date()},
        {name: 'creator_group_1', createdAt: new Date(), updatedAt: new Date()},
        {name: 'student_group_1', createdAt: new Date(), updatedAt: new Date()},
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
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
