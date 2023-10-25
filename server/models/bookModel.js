const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    sell: {
        type: Boolean,
        required: true
    },
    rent: {
        type: Boolean,
        required: true
    },
    offer: {
        type: Boolean,
        required: true
    },
    rentPrice: {
        type: Number,
        required: true
    },
    buyPrice: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    imageUrls: {
        type: Array,
        required: true
    },
    userRef: {
        type: String,
        required: true
    },
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true })

const Book = mongoose.model('Books', bookSchema)

module.exports = { Book }
