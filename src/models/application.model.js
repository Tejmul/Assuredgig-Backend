const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Application = sequelize.define('Application', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    proposal: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    expectedDeliveryDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'hired', 'rejected'),
      defaultValue: 'pending'
    },
    bidAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    }
  });

  return Application;
}; 