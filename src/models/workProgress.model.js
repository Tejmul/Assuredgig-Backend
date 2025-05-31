const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WorkProgress = sequelize.define('WorkProgress', {
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
    progressPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    status: {
      type: DataTypes.ENUM('in_progress', 'completed', 'blocked'),
      defaultValue: 'in_progress'
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    comments: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    milestoneId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  });

  return WorkProgress;
}; 