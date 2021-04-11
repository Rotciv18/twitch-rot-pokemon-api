module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.addColumn('pokemons', 'user_id', {
      type: Sequelize.STRING,
      references: { model: 'users', key: 'id' },
      allowNull: false,
    }),

  down: async (queryInterface) =>
    queryInterface.removeColumn('pokemons', 'user_id'),
};
