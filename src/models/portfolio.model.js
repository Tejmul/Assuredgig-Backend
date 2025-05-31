const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Portfolio = sequelize.define('Portfolio', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    projectUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    technologies: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isOngoing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return Portfolio;
}; 