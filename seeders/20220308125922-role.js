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
    const userId = await queryInterface.rawSelect(
      'Users',
      {where: {email: "leader@mail.loc"}},
      ['id']
    )

    await queryInterface.bulkInsert(
      'Roles',
      [
        {name: 'all'},
        {name: 'users'},
        {name: `user_${userId}`},
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
