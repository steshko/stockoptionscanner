const User = require('../../database/models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = async function reset(req, res)  {
    try{

        const {token, password} = req.body

        if (!token) {
            return res.status(400).json ({message: 'auth.error.resetPasswordTokenNotPresent' })
        }
        if (!password) {
            return res.status(400).json ({message: 'auth.error.resetPasswordNotPresent' })
        }

        const date = new Date
        const user = await User.findOne({
            emailVerified: true,
            passwordResetToken: token, 
            passwordResetTokenExpiresAt: {$gt: date}
        })

        if (user) {
            const hashedPassword = await bcrypt.hash(password, 12)
            user.password = hashedPassword
            user.passwordResetToken = null
            user.passwordResetTokenExpiresAt = null
            await user.save()

            const JWT = process.env.JWT
            const JWTEXPIRESIN = process.env.JWTEXPIRESIN
            const token = jwt.sign({
                    userId: user.id, 
                    userName: user.userName,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    roles: user.roles
                },
                JWT,
                { expiresIn: JWTEXPIRESIN }
            )
    
            return res.json({
                token, 
                userId: user.id, 
                userName: user.userName,
                email: user.email,
                rememberMe: true,
                emailVerified: user.emailVerified,
                roles: user.roles
            })
                

        } else {
            return res.status(400).json ({message: 'auth.error.resetPasswordTokenNotFound' })
        }

    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message);
        }
      
        console.error(error);
        return res.status(500).send(error.message);
    }
}
