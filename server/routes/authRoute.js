const express = require('express')
const { signup, signin, google, signout, forgotPassword } = require('../controllers/authController')

const authRouter = express.Router()

authRouter.post('/signup', signup)
authRouter.post('/signin', signin)
authRouter.post('/google', google)
authRouter.get('/signout', signout)
authRouter.post('/forgotPassword', forgotPassword)

module.exports = authRouter