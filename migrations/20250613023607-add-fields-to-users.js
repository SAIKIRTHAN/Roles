'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'firstName', Sequelize.STRING);
    await queryInterface.addColumn('users', 'lastName', Sequelize.STRING);
    await queryInterface.addColumn('users', 'emailId', Sequelize.STRING);
    await queryInterface.addColumn('users', 'products', Sequelize.STRING); // or Sequelize.STRING
    await queryInterface.addColumn('users', 'phoneNumber', Sequelize.STRING);
    await queryInterface.addColumn('users', 'password', Sequelize.STRING);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
