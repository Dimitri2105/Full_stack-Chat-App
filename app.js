const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const  cors = require('cors')
const dotenv = require('dotenv')
const sequelize = require('./database/database')
dotenv.config()

const userRoute = require('./routes/userRoutes')
const chatRoute = require('./routes/chatRoutes')
const groupRoute = require('./routes/groupRoutes')

const User = require('./modals/userModal')
const Chat = require('./modals/chatModal')
const Group = require('./modals/groupModal')
const userGroup = require('./modals/userGroupModal')


const app = express()

app.use(cors({
    origin: '*',
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname, 'views')));


app.use(userRoute)
app.use(chatRoute)
app.use(groupRoute)


User.hasMany(Chat)
Chat.belongsTo(User)

Group.hasMany(Chat)
Chat.belongsTo(User)

User.belongsToMany(Group , { through : userGroup})
Group.belongsToMany(User , { through : userGroup})

Group.hasMany(userGroup)
userGroup.belongsTo(Group);


sequelize
.sync()
.then( result =>{
    app.listen(8000 , () =>{
        console.log('Server listening on port 8000')
    })

})