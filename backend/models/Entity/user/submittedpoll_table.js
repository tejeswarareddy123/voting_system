// models/SubmittedPoll.js
module.exports = (sequelize, DataTypes) => {
    const SubmittedPoll = sequelize.define('SubmittedPoll', {
      submission_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      poll_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      selected_option_index: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      submission_timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      timestamps: false,
    });
  
    return SubmittedPoll;
  };
  