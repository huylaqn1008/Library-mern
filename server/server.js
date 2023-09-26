const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRouter = require('./routes/userRoute')
const signupRouter = require('./routes/authRoute')


const app = express()

app.use(express.json())

dotenv.config()

mongoose.connect(process.env.MONGODB).then(() => {
    console.log('Connected to MongoDB!!!')
}).catch((err) => {
    console.log(err)
})

app.use('/api/user', userRouter)
app.use('/api/auth', signupRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
