const express = require('express')
const { createBook, deleteBook } = require('../controllers/bookController')
const vefiryToken = require('../utils/verifyUser')

const bookRouter = express.Router()

bookRouter.post('/create', vefiryToken, createBook)
bookRouter.delete('/delete/:id', vefiryToken, deleteBook)

module.exports = bookRouter