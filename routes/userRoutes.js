const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router()

router.post('/user/signup',userController.signup)

router.post('/user/logIn',userController.logIn)

router.get('/user/allloggedUsers',userController.getAllUsers)

module.exports = router