const errorHandler = require('../utils/error')
const User = require('./../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signup = async (req, res) => {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email is already exist' });
    }

    if (!password) {
        return res.status(400).json({ error: 'Password is required' })
    }

    const hashedPassword = await bcrypt.hashSync(password, 10)

    const newUser = new User({
        username, email, password: hashedPassword
    })

    try {
        await newUser.save()
        res.status(201).json("User created successfully")
    } catch (error) {
        res.status(500).json({
            error: 'User created failure'
        })
    }
}

const signin = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const validUser = await User.findOne({ email })
        if (!validUser)
            return next(errorHandler(404, 'User not found!'))

        const validPassword = bcrypt.compareSync(password, validUser.password)
        if (!validPassword)
            return next(errorHandler(401, 'Invalid password!'))

        const token = jwt.sign({ id: validUser._id }, process.env.JWT)
        const { password: pass, ...rest } = validUser._doc
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

module.exports = { signup, signin }
