const User = require("../modals/userModal");
const Chat = require("../modals/chatModal");
const Group = require("../modals/groupModal")
const userGroup = require("../modals/userGroupModal")

const Sequelize = require('sequelize')
const bcrypt = require("bcrypt");
const jst = require("jsonwebtoken")

exports.createGroup = async(req,res,next) =>{
    const groupName = req.body.groupName

    if(!groupName){
        res.status(400).json({message : "Required Group Name"})
    }
    try{
        const groupCreated = await Group.create({
            userId:req.user.id,
            groupName :groupName
    
        })
        const userGroupInfo = await userGroup.create({
            userId : req.user.id ,
            groupId  : groupCreated.id
        })
        res.status(200).json({message  : "Successfully created group", groupName  : groupCreated})

    }catch(error){
        console.log(error)
        res.status(404).json({message : "Unable to create group"})
    }
}

exports.getGroups = async(req,res,next) =>{
    console.log("inside get groups>>>")
    try{
        const allGroups = await Group.findAll({where  : {userId : req.user.id}})
        // console.log("all groups are ???????" , allGroups)
        res.status(200).json({message : "Successfull" , groups : allGroups})


    }catch(error){
        console.log(error)
        res.status(400).json({message : "Unable to retrieve groups"})
    }
}

exports.getGroupMessages = async(req,res,next) =>{
    try{
        const groupId = req.query.groupId
        console.log("groupParams messages are >>>>>>>" , groupId)

        const messages = await Chat.findAll({
            where : {groupId : groupId},
            include: { 
                model: User ,
                attributes: ['userName']
              }
        } )
        console.log("messages are>>>>>>>>>>" ,messages)
        res.status(200).json({messages : messages})



    }catch(error){
        console.log(error)
        res.status(400).json({message : "Unable to retrieve current group messages "})
    }
}