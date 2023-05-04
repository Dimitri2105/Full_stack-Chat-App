const Chat = require("../modals/chatModal");
const User = require("../modals/userModal")

exports.chatMessage = async (req, res, next) => {
  try {
    const message = req.body.userMessage;

    const chatMessage = await Chat.create({
      userId: req.user.id,
      chatMessage: message,
    });
    res.status(200).json({ chatMessage: chatMessage, message: "chat message sent" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Unable to send message" });
  }
};

exports.getMessage = async(req,res,next) =>{
    try{
        const userMessage = await Chat.findAll(
            {where:{userId : req.user.id},
            include: { model: User }
        })
        res.status(200).json({userMessage : userMessage})
    }catch(error){
        console.log(error)
        res.status(400).json({message : 'Unable to fetch messages'})
    }
}