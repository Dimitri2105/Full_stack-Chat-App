const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const  cors = require('cors')
const dotenv = require('dotenv')
const sequelize = require('./database/database')
dotenv.config()

const userRoute = require('./routes/userRoutes')
const chatRoute = require('./routes/chatRoutes')

const User = require('./modals/userModal')
const Chat = require('./modals/chatModal')


const app = express()

app.use(cors({
    origin: '*',
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname, 'views')));


app.use(userRoute)
app.use(chatRoute)


User.hasMany(Chat)
Chat.belongsTo(User)

sequelize
.sync()
.then( result =>{
    app.listen(8000 , () =>{
        console.log('Server listening on port 8000')
    })

})