const express = require('express')
const { signup } = require('../controllers/authController')

const signupRouter = express.Router()

signupRouter.post('/signup', signup)

module.exports = signupRouter