const express = require('express')
const { createBook, deleteBook, updateBook, getBook, getBooks, rateAndCommentBook, getBookComments } = require('../controllers/bookController')
const verifyToken = require('../utils/verify')

const bookRouter = express.Router()

bookRouter.post('/create', verifyToken, createBook)
bookRouter.delete('/delete/:id', verifyToken, deleteBook)
bookRouter.post('/update/:id', verifyToken, updateBook)
bookRouter.get('/get/:id', getBook)
bookRouter.get('/get', getBooks)
bookRouter.post('/ratings/:id', verifyToken, rateAndCommentBook)
bookRouter.get('/ratings/:id', getBookComments)

module.exports = bookRouter