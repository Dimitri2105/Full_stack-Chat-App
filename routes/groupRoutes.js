const express = require('express')

const groupController = require('../controllers/groupController')
const userAuthentication = require('../middleware/auth')

const router = express.Router()

router.post('/user/createGroup',userAuthentication.authenticate,groupController.createGroup)

router.get('/user/getGroup',userAuthentication.authenticate,groupController.getGroups)

router.get('/user/getGroupMessages',userAuthentication.authenticate,groupController.getGroupMessages)

module.exports = router


