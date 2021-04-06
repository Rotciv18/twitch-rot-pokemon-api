module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pokemons', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      pokemon_data_id: {
        type: Sequelize.INTEGER,
        references: { model: 'pokemon_datas', key: 'id' },
        allowNull: false,
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      moves: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('pokemons');
  },
};
