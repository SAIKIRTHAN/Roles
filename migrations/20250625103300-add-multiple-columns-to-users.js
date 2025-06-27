'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
      await queryInterface.addColumn('Otps', 'userId', {
      type: Sequelize.INTEGER, // or any other datatype
      allowNull: true         // or false, based on your need
    });
      await queryInterface.addColumn('Otps', 'expiry_time', {
      type: Sequelize.DATE, // or any other datatype
      allowNull: true         // or false, based on your need
    });
    
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Otps');
  }
};