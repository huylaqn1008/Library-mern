const express = require('express')
const { createBook } = require('../controllers/bookController')
const vefiryToken = require('../utils/verifyUser')

const bookRouter = express.Router()

bookRouter.post('/create', vefiryToken, createBook)

module.exports = bookRouter