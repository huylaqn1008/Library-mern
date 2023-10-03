const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const { Book } = require('../models/bookModel')

const test = (req, res) => {
    res.json({
        message: 'Api route is working'
    })
}

const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
        return res.status(401).json({ error: 'You can only update your own account!!!' })

    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username || user.username,
                email: req.body.email || user.email,
                password: req.body.password || user.password,
                avatar: req.body.avatar || user.avatar,
                gender: req.body.gender || user.gender,
                phoneNumber: req.body.phoneNumber || user.phoneNumber,
                address: req.body.address || user.address,
            }
        }, { new: true })

        const { password, ...rest } = updatedUser._doc

        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

const getUserBooks = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const books = await Book.find({
                userRef: req.params.id
            })
            res.status(200).json(books)
        } catch (error) {
            return next(error)
        }
    } else {
        return res.status(401).json({ error: 'You can only view your own books!!!' })
    }
}

module.exports = { test, updateUser, getUserBooks }
