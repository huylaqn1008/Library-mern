const { Book } = require("../models/bookModel")

const createBook = async (req, res, next) => {
    try {
        const book = await Book.create(req.body)
        return res.status(201).json(book)
    } catch (error) {
        next(error)
    }
}

const deleteBook = async (req, res, next) => {
    const book = await Book.findById(req.params.id)

    if (!book) {
        return res.status(404).json({
            error: 'Book not found'
        })
    }

    if (req.user.id !== book.userRef) {
        return res.status(401).json({
            error: 'You can only delete your own books!'
        })
    }

    try {
        await Book.findByIdAndDelete(req.params.id)
        res.status(200).json('Listing has been deleted!')
    } catch (error) {
        next(error)
    }
}

const updateBook = async (req, res, next) => {
    const book = await Book.findById(req.params.id)

    if (!book) {
        return res.status(404).json({
            error: 'Book not found'
        })
    }

    if (req.user.id !== book.userRef) {
        return res.status(401).json({
            error: 'You can only update your own books!'
        })
    }

    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.status(200).json(updatedBook)
    } catch (error) {
        next(error)
    }
}

const getBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id)

        if (!book) {
            return res.status(404).json({
                error: 'Book not found'
            })
        }

        res.status(200).json(book)
    } catch (error) {
        next(error)
    }
}

module.exports = { createBook, deleteBook, updateBook, getBook }