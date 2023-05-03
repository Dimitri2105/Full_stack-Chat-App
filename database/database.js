const Sequelize = require('sequelize')
const dotenv = require('dotenv')

dotenv.config()

const sequelize = new Sequelize("node-chatapp","root","Tarathakur@21",{
    host: "localhost",
    dialect:'mysql'
})

module.exports = sequelize
