module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('positions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.STRING,
        references: { model: 'users', key: 'id' },
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      position_type: {
        type: Sequelize.ENUM('gym', 'elite', 'champion'),
        allowNull: false,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
    await queryInterface.bulkInsert('positions', [
      { name: 'Pewter', position_type: 'gym' },
      { name: 'Cerulean', position_type: 'gym' },
      { name: 'Vermilion', position_type: 'gym' },
      { name: 'Celadon', position_type: 'gym' },
      { name: 'Fuchsia', position_type: 'gym' },
      { name: 'Saffron', position_type: 'gym' },
      { name: 'Cinnabar', position_type: 'gym' },
      { name: 'Viridian', position_type: 'gym' },
      { name: 'Escarlate', position_type: 'elite' },
      { name: 'Violeta', position_type: 'elite' },
      { name: 'Âmbar', position_type: 'elite' },
      { name: 'Ciano', position_type: 'elite' },
      { name: 'Campeão de Kanto', position_type: 'champion' },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('positions');
  },
};
