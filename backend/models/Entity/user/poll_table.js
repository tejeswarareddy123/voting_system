// models/Poll.js
module.exports = (sequelize, DataTypes) => {
    const Poll = sequelize.define('Poll', {
      poll_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      options: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          isValidJson(value) {
            try {
              JSON.parse(value);
            } catch (error) {
              throw new Error('Invalid JSON format for options');
            }
          },
        },
      },
    }, {
      timestamps: false,
    });
  
    return Poll;
  };
  