const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const  cors = require('cors')
const dotenv = require('dotenv')
const sequelize = require('./database/database')
const socketIO = require('socket.io')
const http = require('http')
dotenv.config()

const userRoute = require('./routes/userRoutes')
const chatRoute = require('./routes/chatRoutes')
const groupRoute = require('./routes/groupRoutes')

const User = require('./modals/userModal')
const Chat = require('./modals/chatModal')
const Group = require('./modals/groupModal')
const userGroup = require('./modals/userGroupModal')
const { Server } = require('https')

const chatController = require('./controllers/chatController')


const app = express()
const server = http.createServer(app)
const io = socketIO(server,{
    cors:['http://localhost:8000']
})

// app.use(cors({
//     origin: ['http://localhost:8000'],
//     methods: ['GET','POST','DELETE','PATCH']
// }));

// app.use(cors( { 
//     origin : '*'
// }))

app.use(cors())

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


io.on("connection" , (socket) =>{
    console.log(`User is connected with socket ID : ${socket.id}`)

    chatController.respond(socket)

    // socket.on("chatMessage" , (obj) =>{
    //     console.log("chatMEssage receieved on server side >>>>>>>>>>>>>>>")
    //     console.log("obj  >>>>>>>>>>" , obj)

    //     // socket.to(group).emit("chatMessage" , {group , message})
    // })
})

sequelize
.sync()
.then( result =>{
    server.listen(8000 , () =>{
        console.log('Server listening on port 8000')
    })
    

})
