const express = require('express')
const { buyPayment, getAllBuyPayments } = require('../controllers/buyController')

const buyPaymentRoute = express.Router()

buyPaymentRoute.post('/buypayment', buyPayment)
buyPaymentRoute.get('/buypayment', getAllBuyPayments)

module.exports = buyPaymentRoute