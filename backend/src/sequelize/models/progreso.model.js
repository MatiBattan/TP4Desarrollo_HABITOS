module.exports = (sequelize, DataTypes) => {
	const Progreso = sequelize.define('Progreso', {
	  fecha: {
		type: DataTypes.DATE,
		allowNull: false,
	  },
	  cumplido: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	  },
	  horas: {
		type: DataTypes.INTEGER,
		allowNull: true,
	  },
	});
  
	Progreso.associate = (models) => {
	  Progreso.belongsTo(models.Habito, {
		foreignKey: 'HabitoId',
		as: 'habito',
	  });
	};
  
	return Progreso;
  };
  