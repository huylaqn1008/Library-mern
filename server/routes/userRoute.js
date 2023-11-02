const express = require('express')
const { test, updateUser, getUserBooks, getUser, getAllUsers, updateUserRole } = require('../controllers/userController')
const verifyToken = require('../utils/verify')

const userRouter = express.Router()

userRouter.get('/test', test)
userRouter.post('/update/:id', verifyToken, updateUser)
userRouter.get('/books/:id', verifyToken, getUserBooks)
userRouter.get('/all', verifyToken, getAllUsers)
userRouter.get('/:id', verifyToken, getUser)
userRouter.post('/update-role/:id', verifyToken, updateUserRole)

module.exports = userRouter