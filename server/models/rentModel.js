const mongoose = require('mongoose')

const rentPaymentSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    bookTitle: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    rentalStartDate: {
        type: Date,
        required: true
    },
    rentalEndDate: {
        type: Date,
        required: true
    },
    rentalTotalPrice: {
        type: Number,
        required: true
    },
    rentalStatus: {
        type: String,
        enum: ['Pending', 'Active'],
        default: 'Pending'
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const RentPayment = mongoose.model('Rentpayment', rentPaymentSchema)

module.exports = { RentPayment }
