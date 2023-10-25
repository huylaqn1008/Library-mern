const { Book } = require("../models/bookModel")
const { RentPayment } = require("../models/rentModel")

const rentPayment = async (req, res, next) => {
    try {
        const {
            userName,
            email,
            bookTitle,
            authorName,
            category,
            rentalStartDate,
            rentalEndDate,
            rentalTotalPrice,
        } = req.body

        const book = await Book.findOne({ name: bookTitle, author: authorName })

        if (!book) {
            return res.status(404).json({ message: 'Book not found' })
        }

        if (book.quantity <= 0) {
            return res.status(400).json({ message: 'Book is out of stock' })
        }

        const rentPayment = new RentPayment({
            userName,
            email,
            bookTitle,
            authorName,
            category,
            rentalStartDate,
            rentalEndDate,
            rentalTotalPrice,
            rentalStatus: 'Active',
            bookId: book._id
        })

        await rentPayment.save()

        if (rentPayment.rentalStatus === 'Active') {
            book.quantity -= 1
        }

        await book.save()

        res.status(200).json({ message: 'Payment successful' })
    } catch (error) {
        next(error)
    }
}

const updateRentalStatus = async (req, res, next) => {
    try {
        const { rentPaymentId } = req.params

        const rentPayment = await RentPayment.findByIdAndUpdate(
            rentPaymentId,
            { rentalStatus: 'Pending' },
            { new: true }
        )

        if (!rentPayment) {
            return res.status(404).json({ message: 'Rent payment not found' })
        }

        const bookId = rentPayment.bookId

        const book = await Book.findById(bookId)

        if (!book) {
            return res.status(404).json({ message: 'Book not found' })
        }

        book.quantity += 1
        await book.save()

        res.status(200).json({ message: 'Rental status updated to Pending' })
    } catch (error) {
        next(error)
    }
}

const getRentPayment = async (req, res, next) => {
    try {
        const { rentPaymentId } = req.params

        const rentPayment = await RentPayment.findById(rentPaymentId)

        if (!rentPayment) {
            return res.status(404).json({ message: 'Rent payment not found' })
        }

        res.status(200).json({ rentPayment })
    } catch (error) {
        next(error)
    }
}

const getAllRentPayments = async (req, res, next) => {
    try {
        const rentPayments = await RentPayment.find()

        res.status(200).json({ rentPayments })
    } catch (error) {
        next(error)
    }
}

module.exports = { rentPayment, updateRentalStatus, getRentPayment, getAllRentPayments }
