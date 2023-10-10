const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "https://img.freepik.com/premium-vector/anonymous-user-flat-icon-vector-illustration-with-long-shadow_520826-1932.jpg"
    },
    phoneNumber: {
        type: String
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    address: {
        type: String
    },
    otp: {
        type: String
    },
    otpExpiration: {
        type: Date
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User
