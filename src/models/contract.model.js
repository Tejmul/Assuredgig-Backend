const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Contract = sequelize.define('Contract', {
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
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    milestones: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    paymentSchedule: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  return Contract;
}; 