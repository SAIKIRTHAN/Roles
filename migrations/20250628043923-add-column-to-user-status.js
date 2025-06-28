'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     return queryInterface.addColumn('users', 'status', {
      type: Sequelize.STRING, // Change to INTEGER, BOOLEAN, etc., as needed
      allowNull: true,        // Or false if required
      defaultValue: "INACTIVE"      // You can set default if needed
    });/**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
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
