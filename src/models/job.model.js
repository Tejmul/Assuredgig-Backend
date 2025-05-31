const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Job = sequelize.define('Job', {
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
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('open', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'open'
    },
    requiredSkills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    experienceLevel: {
      type: DataTypes.ENUM('entry', 'intermediate', 'expert'),
      allowNull: false
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  });

  return Job;
}; 