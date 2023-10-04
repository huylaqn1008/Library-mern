const express = require('express')
const { test, updateUser, getUserBooks, getUser } = require('../controllers/userController')
const verifyToken = require('../utils/verify')

const userRouter = express.Router()

userRouter.get('/test', test)
userRouter.post('/update/:id', verifyToken, updateUser)
userRouter.get('/books/:id', verifyToken, getUserBooks)
userRouter.get('/:id', verifyToken, getUser)

module.exports = userRouter