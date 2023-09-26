const express = require('express')

const userRouter = express.Router()

userRouter.get('/test', (req, res) => {
    res.json({
        message: 'Hello World!'
    })
})

module.exports = userRouter