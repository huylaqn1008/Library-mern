const express = require('express')
const { buyPayment } = require('../controllers/buyController')

const buyPaymentRoute = express.Router()

buyPaymentRoute.post('/buyPayment', buyPayment)

module.exports = buyPaymentRoute