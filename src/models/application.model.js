const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Application = sequelize.define('Application', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    proposedRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending'
    },
    freelancerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    jobId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Jobs',
        key: 'id'
      }
    }
  });

  return Application;
}; 