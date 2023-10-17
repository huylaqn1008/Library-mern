const express = require('express')
const { rentPayment, updateRentalStatus, getRentPayment, getAllRentPayments } = require('../controllers/rentController')

const rentPaymentRoute = express.Router()

rentPaymentRoute.post('/rentpayment', rentPayment)
rentPaymentRoute.post('/rentpayment/:rentPaymentId', updateRentalStatus)
rentPaymentRoute.get('/rentpayment/:rentPaymentId', getRentPayment)
rentPaymentRoute.get('/rentpayment', getAllRentPayments)

module.exports = rentPaymentRoute