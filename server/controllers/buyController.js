const { Book } = require("../models/bookModel")
const BuyPayment = require("../models/buyModel")

const buyPayment = async (req, res, next) => {
    try {
        const { username, email, phone, address, cartItems, totalPrice } = req.body

        const insufficientBooks = await Promise.all(
            cartItems.map(async (item) => {
                const book = await Book.findById(item.bookId)
                return book.quantity < item.quantity
            })
        )

        if (insufficientBooks.includes(true)) {
            return res.status(400).json({ error: 'Insufficient quantity for one or more books' })
        }

        const payment = new BuyPayment({
            username,
            email,
            phone,
            address,
            cartItems,
            totalPrice
        })

        await payment.save()

        await Promise.all(
            cartItems.map(async (item) => {
                const book = await Book.findById(item.bookId)
                book.quantity -= item.quantity
                await book.save()
            })
        )

        res.status(200).json({ message: 'Payment information saved successfully' })
    } catch (error) {
        next(error)
    }
}

const getAllBuyPayments = async (req, res, next) => {
    try {
        const buyPayments = await BuyPayment.find()
        const books = await Book.find()

        res.status(200).json({ buyPayments, books })
    } catch (error) {
        next(error)
    }
}

module.exports = { buyPayment, getAllBuyPayments }
