// const {check, validationResult} = require('express-validator')
const User = require('../../database/models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendEmail = require('../sendGridEmail')
const config = require('../../config')()


module.exports = async function login(req, res)  {
    try{
        const {password, email} = req.body

        if (!email || !email.includes('@') || !email.includes('.') || email[0] === '@') {
            return res.status(400).json ({message: 'auth.error.emailIncorrect'})
        }

        const existingEmail = await User.findOne({email: email});

        if (existingEmail) {
            return res.status(400).json ({message: 'auth.error.emailAlreadyExists'})
        }

        if (!password) {
            return res.status(400).json ({message: 'auth.error.password'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const emailVerificationToken = require('crypto').randomBytes(16).toString('hex')
        const emailVerificationTokenExpiresAt = Date.now() + 24 * 30 * 60 * 60 * 1000

        const user = new User({
            password: hashedPassword,
            email: email,
            emailVerified: false,
            emailVerificationToken: emailVerificationToken,
            emailVerificationTokenExpiresAt: emailVerificationTokenExpiresAt,
            roles: ['newcomer'],
            industryColor: [],
            calcYield: 100,
            minStockPrice: 0,
            maxStockPrice: 9999,
            marginInterest: 0,
        
        })

        await user.save()

        const JWT = process.env.JWT
        const JWTEXPIRESIN = process.env.JWTEXPIRESIN
        const token = jwt.sign({
            userId: user.id, 
            email: user.email,
            emailVerified: user.emailVerified,
            roles: user.roles,
        },
        JWT,
        { expiresIn: JWTEXPIRESIN }
        )

        sendEmail(
            user.email, 
            config.emailTemplateRegister, 
            {
                URL: config.clientUrl + '/confirm?token=' + emailVerificationToken,
                site: config.clientUrl
            }
        )

        return res.json({
            token, 
            userId: user.id, 
            email: user.email,
            rememberMe: true,
            emailVerified: false,
            roles: user.roles
        })


    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message);
        }
      
        console.error(error);
        return res.status(500).send(error.message);
    }    
}