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
    const allRoleId = await queryInterface.rawSelect('Roles', {where: {name: "all"}}, ['id'])
    const usersRoleId = await queryInterface.rawSelect('Roles', {where: {name: "users"}}, ['id'])
    const userIndividualRoleId = await queryInterface.rawSelect('Roles', {where: {name: `user_${userId}`}}, ['id'])

    await queryInterface.bulkInsert(
      'Users_Roles',
      [
        {userId, roleId: allRoleId},
        {userId, roleId: usersRoleId},
        {userId, roleId: userIndividualRoleId},
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
