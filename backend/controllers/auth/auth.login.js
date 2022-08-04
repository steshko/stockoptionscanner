const User = require('../../database/models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const LoginLog = require('../../database/models/LoginLog')

module.exports = async function login(req, res)  {
    try{
        let {email, password, rememberMe} = req.body

        if (!email) {
            return res.status(400).json ({message: 'auth.error.emptyEmail'})
        }

        let user = await User.findOne({email: email, disabled: false})
        if (!user) {
            return res.status(400).json ({message: 'auth.error.login'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json ({message: 'auth.error.login'})
        }

        const JWT = process.env.JWT
        const JWTEXPIRESIN = process.env.JWTEXPIRESIN
        const token = jwt.sign({ 
            userId: user.id, 
            email: user.email,
            emailVerified: user.emailVerified,
            roles: user.roles,
            industryColor: user.roles,
            calcYield: user.calcYield,
            minStockPrice: user.minStockPrice,
            maxStockPrice: user.maxStockPrice,
            marginInterest: user.marginInterest,

        },
        JWT,
        { expiresIn: JWTEXPIRESIN }
        )

        new LoginLog({
            userName: email, 
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
        }).save()

        return res.json({
            token, 
            userId: user.id, 
            email: user.email,
            rememberMe: rememberMe,
            emailVerified: user.emailVerified,
            roles: user.roles,
            industryColor: user.industryColor,
            calcYield: user.calcYield,
            minStockPrice: user.minStockPrice,
            maxStockPrice: user.maxStockPrice,
            marginInterest: user.marginInterest,
        
        })


    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message);
        }
      
        console.error(error);
        return res.status(500).send(error.message);
    }
}
