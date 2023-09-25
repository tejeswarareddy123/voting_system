
const { Sequelize, DataTypes } = require("sequelize");
const db_config = require("../../config/db-config.js")
const sql = require("mysql2/promise")

sql.
    createConnection({ user: db_config.USER, password: db_config.PASSWORD })
    .then(()=>
    {
        console.log("db CONNECTED successfully")
    })

const sequelize= new Sequelize(
    db_config.DATABASE,
    db_config.USER,
    db_config.PASSWORD,{
        host:db_config.HOST,
        dialect:db_config.DIALECT,
    }
) 

const db={}
db.sequelize=sequelize
db.USER=require("./user/user_table.js")(sequelize,DataTypes)
db.POLL=require("./user/poll_table.js")(sequelize,DataTypes)
db.SUBMITTED_POLL=require("./user/submittedpoll_table.js")(sequelize,DataTypes)
// db.ADMIN_TRAINING=require("./admin/Schedule_training.js")(sequelize,DataTypes)
// db.TRAININGS=require("./trainings/registered_user_table.js")(sequelize,DataTypes)


db.sequelize.sync({ force: false }, () => {

    console.log("Sync done");
  
  });
  

  
  module.exports = db;

console.log('connection successful !!!')