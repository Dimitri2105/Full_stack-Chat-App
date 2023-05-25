const  Sequelize = require('sequelize')

const sequelize = require('../database/database')

const archivedChat = sequelize.define('archivedChat',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull: false,
        primaryKey: true
      },
    userId:{
        type:Sequelize.STRING,
        allowNull:false
    },
    groupId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    chatMessage:{
        type:Sequelize.STRING,
        allowNull:false
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    }
})

module.exports = archivedChat