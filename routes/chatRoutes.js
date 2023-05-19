const express = require('express')

const chatController = require('../controllers/chatController')
const userAuthentication = require('../middleware/auth')

const router = express.Router()

router.post('/user/send-message',userAuthentication.authenticate,chatController.chatMessage)

router.get('/user/get-message',userAuthentication.authenticate,chatController.getMessage)




module.exports = router