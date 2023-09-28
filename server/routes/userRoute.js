const express = require('express')
const { test, updateUser } = require('../controllers/userController')
const vefiryToken = require('../utils/verifyUser')

const userRouter = express.Router()

userRouter.get('/test', test)
userRouter.post('/update/:id', vefiryToken, updateUser)

module.exports = userRouter