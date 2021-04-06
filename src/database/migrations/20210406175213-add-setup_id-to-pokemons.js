module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.addColumn('pokemons', 'setup_id', {
      type: Sequelize.INTEGER,
      references: { model: 'setups', key: 'id' },
      allowNull: true,
    }),
  down: async (queryInterface) =>
    queryInterface.removeColumn('pokemons', 'setup_id'),
};
