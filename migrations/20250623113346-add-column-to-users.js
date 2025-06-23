'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'user_role', {
      type: Sequelize.STRING, // Change to INTEGER, BOOLEAN, etc., as needed
      allowNull: true,        // Or false if required
      defaultValue: null      // You can set default if needed
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'newColumnName');
  }
};
