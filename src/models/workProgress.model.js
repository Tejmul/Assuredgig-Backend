const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WorkProgress = sequelize.define('WorkProgress', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    contractId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Contracts',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    percentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    hoursWorked: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    clientFeedback: {
      type: DataTypes.TEXT
    },
    clientFeedbackDate: {
      type: DataTypes.DATE
    }
  }, {
    timestamps: true
  });

  WorkProgress.associate = (models) => {
    WorkProgress.belongsTo(models.Contract, { foreignKey: 'contractId' });
  };

  return WorkProgress;
}; 