const express = require('express')
const { test, updateUser, getUserBooks } = require('../controllers/userController')
const verifyToken = require('../utils/verify')

const userRouter = express.Router()

userRouter.get('/test', test)
userRouter.post('/update/:id', verifyToken, updateUser)
userRouter.get('/books/:id', verifyToken, getUserBooks)

module.exports = userRouter