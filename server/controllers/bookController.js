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

const getBooks = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9
        const startIndex = parseInt(req.query.startIndex) || 0

        let offer = req.query.offer
        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] }
        }

        let sell = req.query.sell
        if (sell === undefined || sell === 'false') {
            sell = { $in: [false, true] }
        }

        let rent = req.query.rent
        if (rent === undefined || rent === 'false') {
            rent = { $in: [false, true] }
        }

        const searchTerm = req.query.searchTerm || ''

        const sort = req.query.sort || 'name'

        const order = req.query.order === 'asc' ? 1 : -1

        const books = await Book.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { author: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } }
            ],
            offer,
            sell,
            rent
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex)

        return res.status(200).json(books)
    } catch (error) {
        next(error)
    }
}

const rateAndCommentBook = async (req, res, next) => {
    const { rating, comment } = req.body
    const bookId = req.params.id
    const userId = req.user.id

    try {
        const book = await Book.findById(bookId)

        if (!book) {
            return res.status(404).json({
                error: 'Book not found'
            })
        }

        const existingRating = book.ratings.find(
            (rating) => rating.user.toString() === userId
        )

        if (existingRating) {
            return res.status(400).json({
                error: 'You have already rated and commented on this book'
            })
        }

        book.ratings.push({ user: userId, rating, comment })
        await book.save()

        res.status(200).json({
            message: 'Rating and comment submitted successfully',
            book: book
        })
    } catch (error) {
        next(error)
    }
}

const getBookComments = async (req, res, next) => {
    try {
        const bookId = req.params.id
        const book = await Book.findById(bookId).populate('ratings.user')

        if (!book) {
            return res.status(404).json({
                error: 'Book not found'
            })
        }

        const comments = book.ratings.map((rating) => {
            return {
                user: rating.user.username,
                rating: rating.rating,
                comment: rating.comment,
                createdAt: rating.createdAt
            }
        })

        res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
}

const getAllBooks = async (req, res, next) => {
    try {
        const books = await Book.find()
        res.status(200).json(books)
    } catch (error) {
        next(error)
    }
}

const getTopRating = async (req, res, next) => {
    try {
        const topRatedBooks = await Book.aggregate([
            {
                $addFields: {
                    firstImage: { $arrayElemAt: ['$imageUrls', 0] },
                },
            },
            {
                $project: {
                    name: 1,
                    firstImage: 1,
                    ratings: 1,
                },
            },
            {
                $match: {
                    'ratings.0': { $exists: true },
                },
            },
            {
                $addFields: {
                    averageRating: {
                        $avg: '$ratings.rating',
                    },
                },
            },
            {
                $sort: {
                    averageRating: -1,
                },
            },
        ])

        res.status(200).json(topRatedBooks)
    } catch (error) {
        next(error)
    }
}


module.exports = { createBook, deleteBook, updateBook, getBook, getBooks, rateAndCommentBook, getBookComments, getAllBooks, getTopRating }
