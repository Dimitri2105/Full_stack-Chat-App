const  Sequelize = require('sequelize')

const sequelize = require('../database/database')

const User = require('./userModal')
const Group = require('./groupModal')

const userGroup = sequelize.define('userGroup',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull: false,
        primaryKey: true
      },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references : {
            model : User,
            key : 'id'
        }
      },
    groupId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
            model: Group,
            key : 'id'
        }
    }

})

module.exports = userGroup