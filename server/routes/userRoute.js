const express = require('express')
const { test, updateUser, getUserBooks } = require('../controllers/userController')
const vefiryToken = require('../utils/verifyUser')

const userRouter = express.Router()

userRouter.get('/test', test)
userRouter.post('/update/:id', vefiryToken, updateUser)
userRouter.get('/books/:id', vefiryToken, getUserBooks)

module.exports = userRouter