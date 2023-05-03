const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router()

router.post('/user/signup',userController.signup)

router.post('/user/logIn',userController.logIn)

module.exports = router