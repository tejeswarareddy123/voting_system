// const { TRAININGS } = require("..");
// const admin_table = require("../admin/Schedule_training");
// const registered_user_table = require("../trainings/registered_user_table");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isadmin: {
            type: DataTypes.BOOLEAN,
            defaultValue:false,
        },
            
    },{
        timestamps: false, // This disables createdAt and updatedAt fields
    });

    return User;
}
