const User = require("../modals/userModal");
const Chat = require("../modals/chatModal");
const Group = require("../modals/groupModal");
const userGroup = require("../modals/userGroupModal");

const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jst = require("jsonwebtoken");

exports.createGroup = async (req, res, next) => {
  const groupName = req.body.groupName;
  const admin = req.body.isAdmin;
  console.log("admin is >>>>>>", true);

  if (!groupName) {
    res.status(400).json({ message: "Required Group Name" });
  }
  try {
    const groupCreated = await Group.create({
      userId: req.user.id,
      groupName: groupName,
    });
    const userGroupInfo = await userGroup.create({
      userId: req.user.id,
      groupId: groupCreated.id,
      isAdmin: admin,
    });
    console.log("userInfo is >>>>>>", userGroupInfo);
    res
      .status(200)
      .json({ message: "Successfully created group", groupName: groupCreated });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Unable to create group" });
  }
};

exports.getGroups = async (req, res, next) => {
  try {
    const allGroups = await Group.findAll({
      // where  : {userId : req.user.id}
      // where  : {userId : req.user.id},
      include: {
        model: userGroup,
        where: { userId: req.user.id },
      },
    });
    res.status(200).json({ message: "Successfull", groups: allGroups });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Unable to retrieve groups" });
  }
};

exports.getGroupMessages = async (req, res, next) => {
  try {
    const groupId = req.query.groupId;
    const messages = await Chat.findAll({
      where: { groupId: groupId },
      include: {
        model: User,
        attributes: ["userName"],
      },
    });
    res.status(200).json({ messages: messages });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Unable to retrieve current group messages " });
  }
};

exports.getActiveUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ activeUsers: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch users" });
  }
};

exports.inviteUser = async (req, res, next) => {
  const userMail = req.body.userEmail;
  const groupId = req.body.groupId;
  try {
    const user = await User.findOne({ where: { email: userMail } });
    if (!user) {
      res.status(400).json({ message: "User not found" });
    }
    console.log(" user is <<<<<<<<<<<<<<<" , user )
    const group = await userGroup.findOne({ where: { groupId: groupId } });
    if (!group) {
      res.status(400).json({ message: "Group not found" });
    }
    console.log("group is >>>>>" , group)

    const userGroups = await userGroup.create({
      userId: user.id,
      groupId: group.id,
    });
    res
      .status(200)
      .json({ message: "user invite successfull", userInvited: userGroups });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Unable to Invite User" });
  }
};

exports.removeUser = async (req, res, next) => {
  try {
    const email = req.query.email;
    const groupid = req.query.groupid;

    const checkAdmin = await userGroup.findOne({
      where: { userId: req.user.id, groupId: groupid },
    });

    if (checkAdmin === 0) {
      res.status(400).json({ message: " Admin permission required" });
    }

    const userToDelete = await User.findOne({ where: { email: email } });

    const response = await userGroup.destroy({
      where: { userId: userToDelete.id, groupId: groupid },
    });

    if (response == 0) {
      return res.status(404).json({ message: "User not present in the group" });
    }

    res.status(200).json({ message: "User deletion succesfull" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Unable to remove User" });
  }
};

exports.makeAdmin = async(req,res,next) =>{
  console.log("inside make admin >>>>>>>>>>..")
  console.log("body is >>>>>>>" ,req.body)
  try{

    const email = req.body.email
    const groupId = req.body.groupId

    const user = await User.findOne( { where : { email : email }})

    if(!user){
      res.status(400).json({ message : "User not found"})
    }

    const newAdmin = await userGroup.update({  isAdmin : true } , { where : { userId : user.id , groupId : groupId } })

    res.status(200).json({ message : " Admin created successfully "})


  }
  catch(error){
    console.log(error);
    res.status(400).json({ message: "Unable to make admin " });

  }
}