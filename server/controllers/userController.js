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

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) return res.status(404).json({ error: 'User not found' })

        const { password: pass, ...rest } = user._doc

        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

const updateUserRole = async (req, res, next) => {
    try {
        // if (req.user.role !== 0) {
        //     return res.status(401).json({ error: 'Chỉ admin mới có quyền cập nhật role người dùng.' })
        // }

        const userId = req.params.id

        const newRole = req.body.role

        if (newRole !== 0 && newRole !== 1) {
            return res.status(400).json({ error: 'Role không hợp lệ.' })
        }

        await User.findByIdAndUpdate(userId, { role: newRole })

        res.status(200).json({ message: 'Cập nhật role thành công.' })
    } catch (error) {
        next(error)
    }
}


module.exports = { test, updateUser, getUserBooks, getUser, getAllUsers, updateUserRole }
