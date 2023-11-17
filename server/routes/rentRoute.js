const express = require('express')
const { rentPayment, updateRentalStatus, getRentPayment, getAllRentPayments, getTotalRentalPrice, sendNotification, getUserNotifications } = require('../controllers/rentController')

const rentPaymentRoute = express.Router()

rentPaymentRoute.post('/rentpayment', rentPayment)
rentPaymentRoute.put('/rentpayment/:rentPaymentId', updateRentalStatus)
rentPaymentRoute.get('/rentpayment/:rentPaymentId', getRentPayment)
rentPaymentRoute.get('/rentpayment', getAllRentPayments)
rentPaymentRoute.get('/rentaltotal', getTotalRentalPrice)
rentPaymentRoute.post('/sendNotification/:rentPaymentId', sendNotification)
rentPaymentRoute.get('/getNotifications/:email', getUserNotifications)

module.exports = rentPaymentRoute