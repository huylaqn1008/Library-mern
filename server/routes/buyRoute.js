const express = require('express')
const { buyPayment, getAllBuyPayments, getTotalPriceSum, getLatestBuyPayments } = require('../controllers/buyController')

const buyPaymentRoute = express.Router()

buyPaymentRoute.post('/buypayment', buyPayment)
buyPaymentRoute.get('/buypayment', getAllBuyPayments)
buyPaymentRoute.get('/totalprice', getTotalPriceSum)
buyPaymentRoute.get('/newbuypayment', getLatestBuyPayments)

module.exports = buyPaymentRoute