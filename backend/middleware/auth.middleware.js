const jwt = require('jsonwebtoken')
//const User = require('../database/models/User')

module.exports = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }
    try{

        if (!req.headers.authorization) {
            req.user = { auth: false, userId: undefined, message: 'authorization not provided' }
            return next()
        }
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            req.user = { auth: false, message: 'token not provided' }
            return next()
        }
        const jwtSecret = process.env.JWT

        const decoded = jwt.verify(token, jwtSecret)

        if (decoded) {
            req.user = { 
                auth: true, 
                email: decoded.email,
                roles: decoded.roles,
                userId: decoded.userId,
                emailVerified: decoded.emailVerified
            }
            return next()

        }

        req.user = { auth: false, message: 'token decode error' }

        return next()
    } catch (e) {
        req.user = { auth: false, userName: undefined, userId: undefined, message: e.message }
        return next()
    }
}