module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'position_id', {
      type: Sequelize.INTEGER,
      references: { model: 'positions', key: 'id' },
      allowNull: true,
    }),
  down: async (queryInterface) =>
    queryInterface.removeColumn('users', 'position_id'),
};
