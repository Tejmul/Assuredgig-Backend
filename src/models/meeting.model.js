const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Meeting = sequelize.define('Meeting', {
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
      allowNull: true
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    meetingType: {
      type: DataTypes.ENUM('zoom', 'google_meet', 'other'),
      defaultValue: 'zoom'
    },
    meetingLink: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
      defaultValue: 'scheduled'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  return Meeting;
}; 