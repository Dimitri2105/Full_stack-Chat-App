const Chat = require("../modals/chatModal");
const User = require("../modals/userModal");

const archivedChat = require("../modals/archivedChatModal");
const Sequelize = require("sequelize");
const jwt = require('jsonwebtoken')
const CronJob = require('cron').CronJob;

exports.chatMessage = async (req, res, next) => {
  try {
    const message = req.body.userMessage;
    const chatMessage = await Chat.create({
      userId: req.user.id,
      chatMessage: message,
      groupId: req.body.groupId,
    });
    res
      .status(200)
      .json({ chatMessage: chatMessage, message: "chat message sent" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Unable to send message" });
  }
};

exports.getMessage = async (req, res, next) => {
  try {
    const lastMessageId = parseInt(req.query.lastMessageId) || 0;
    const groupId = req.query.groupId;
    const userMessage = await Chat.findAll({
      where: {
        groupId: groupId,
        id: {
          [Sequelize.Op.gt]: lastMessageId,
        },
        userId: req.user.id,
      },
      include: {
        model: User,
        attributes: ["userName"],
      },
    });
    res.status(200).json({ userMessage: userMessage });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Unable to fetch messages" });
  }
};

const archivedMessages = async() =>{
  console.log("inside ARCHIVED MESSAGES >>>>>>>>>>>>>>")
  try{
    const onedayAgo = new Date( Date.now() - 24 * 60 * 60 * 1000)
    console.log("ONE DAY AGO >>>>>>>>>>>>>>>>>>>>>>" , onedayAgo)

    const oldMessages = await Chat.findAll({where : { 
      createdAt : {
        [Sequelize.Op.lt]: onedayAgo
      }
    }})
    console.log("ONE DAY AGO MESSAGES ARE >>>>>>" , oldMessages)

    const archivedMessages = await archivedChat.bulkCreate(oldMessages)

    console.log("arhivedMesses are >>>>>>>" , archivedMessages)

    const removeOldMessages = await Chat.destroy({where : {
      createdAt : {
        [Sequelize.Op.lt]: onedayAgo
      }
    }})

    console.log("deleted messages are >>>>>>>>" , removeOldMessages)

  }
  catch (error) {
    console.log(error);
    res.status(400).json({ message: "Unable to archive messages" });}
  
}

const job = new CronJob('0 11 * * *', archivedMessages)
job.start()


// exports.respond = async(socket_Io) =>{
  
//     console.log("Inside socket IO of Chatcontroller >>>>>>>>")
//     try{
//       socket_Io.on("chatMessage" ,async (obj) =>{
//         console.log("inside chat message one >>>>>>>>")
//         console.log("Obj of socket.io is  >>>>>>>" , obj)
//         const groupId = obj.group
//         const message = obj.message
//         const token = obj.token


//         const tokenVerification = jwt.verify(token , process.env.TOKEN_SECRET)
//         console.log("TOKEN verification result .>>>>>>>>>>>>" , tokenVerification)
//         if(tokenVerification){
//           const chatMessage = await Chat.create({
//                   userId: tokenVerification.id.id,
//                   chatMessage: message,
//                   groupId: groupId,
//                 });
//           console.log("chatMessage is >>>>>>>>>>>>" , chatMessage)
//           socket_Io.to(groupId).emit("receive Message" , {chatMessage : chatMessage})
//         }else{
//           console.log("Token Verfication Unsuccesfull")
//         }
  
//       })
      

//     }catch(error){
//       console.log(error)


//     }
  

    



  
// }
