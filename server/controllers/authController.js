const User = require('./../models/userModel')
const bcrypt = require('bcrypt')

const signup = async (req, res) => {
    const { username, email, password } = req.body

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

module.exports = { signup }
