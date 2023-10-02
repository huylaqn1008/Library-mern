const { Book } = require("../models/bookModel")

const createBook = async (req, res, next) => {
    try {
        const book = await Book.create(req.body)
        return res.status(201).json(book)
    } catch (error) {
        next(error)
    }
}

module.exports = { createBook }