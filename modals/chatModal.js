const  Sequelize = require('sequelize')

const sequelize = require('../database/database')

const Chat = sequelize.define('chat',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull: false,
        primaryKey: true
      },
    chatMessage:{
        type:Sequelize.STRING,
        allowNull:false
      },

})

module.exports = Chat