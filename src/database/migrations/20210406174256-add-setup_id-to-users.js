module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'setup_id', {
      type: Sequelize.INTEGER,
      references: { model: 'setups', key: 'id' },
      allowNull: true,
    }),

  down: async (queryInterface) =>
    queryInterface.removeColumn('users', 'setup_id'),
};
