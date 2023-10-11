const express = require('express')
const { signup, signin, google, signout, forgotPassword, verifyOtp, resetPassword } = require('../controllers/authController')

const authRouter = express.Router()

authRouter.post('/signup', signup)
authRouter.post('/signin', signin)
authRouter.post('/google', google)
authRouter.get('/signout', signout)
authRouter.post('/forgotPassword', forgotPassword)
authRouter.post('/verifyOtp', verifyOtp)
authRouter.post('/resetPassword', resetPassword)

module.exports = authRouter