const User = require('./../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer')

const signup = async (req, res) => {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email is already exist' })
    }

    if (!password) {
        return res.status(400).json({ error: 'Password is required' })
    }

    const hashedPassword = await bcrypt.hashSync(password, 10)

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: 1
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
        if (!validUser) {
            return res.status(401).json({ error: 'Email not registered!' })
        }

        const validPassword = bcrypt.compareSync(password, validUser.password)
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid password!' })
        }

        const token = jwt.sign({ id: validUser._id }, process.env.JWT)
        const { password: pass, ...rest } = validUser._doc
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT)
            const { password: pass, ...rest } = user._doc
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest)
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10)
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo
            })

            await newUser.save()
            const token = jwt.sign({ id: newUser._id }, process.env.JWT)
            const { password: pass, ...rest } = newUser._doc
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest)
        }
    } catch (error) {
        next(error)
    }
}

const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token')
        res.status(200).json('User has been logged out!')
    } catch (error) {
        next(error)
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        const hashedOTP = await bcrypt.hash(otp, 10)

        user.otp = hashedOTP
        user.otpExpiration = Date.now() + 600000
        await user.save()

        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false,
            },
        })

        const mailOptions = {
            from: 'garena281215@gmail.com',
            to: user.email,
            subject: 'OTP for Password Reset',
            text: `Your OTP for password reset is: ${otp}`,
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                return res.status(500).json({ error: 'Failed to send OTP email' })
            }
            console.log('OTP email sent: ' + info.response)
            res.status(200).json({ message: 'OTP email sent' })
        })
    } catch (error) {
        next(error)
    }
}

const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        if (!user.otp || !user.otpExpiration || user.otpExpiration < Date.now()) {
            return res.status(400).json({ error: 'OTP has expired or not generated' })
        }

        const isOtpValid = await bcrypt.compare(otp, user.otp)

        if (!isOtpValid) {
            return res.status(401).json({ error: 'Invalid OTP' })
        }

        await user.save()

        res.status(200).json({ message: 'OTP verification successful' })
    } catch (error) {
        next(error)
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: 'Missing required data' })
        }

        if (!user.otp || !user.otpExpiration || user.otpExpiration < Date.now()) {
            return res.status(400).json({ error: 'OTP has expired or not generated' })
        }

        const isOtpValid = await bcrypt.compare(otp, user.otp)

        if (!isOtpValid) {
            return res.status(401).json({ error: 'Invalid OTP' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword

        await user.save()

        res.status(200).json({ message: 'Password reset successful' })
    } catch (error) {
        next(error)
    }
}

module.exports = { signup, signin, google, signout, forgotPassword, verifyOtp, resetPassword }
