const jwt = require('jsonwebtoken')

const vefiryToken = (req, res, next) => {
    const token = req.cookies.access_token

    if (!token)
        return res.status(401).json('Unauthorized')

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err)
            return res.status(403).json('Forbidden')

        req.user = user
        next()
    })
}

module.exports = vefiryToken