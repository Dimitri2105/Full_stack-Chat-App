const Chat = require("../modals/chatModal");
const User = require("../modals/userModal");

const Sequelize = require("sequelize");

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
