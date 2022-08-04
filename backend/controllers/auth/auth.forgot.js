const User = require('../../database/models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendEmail = require('../sendGridEmail')
const config = require('../../config')()

module.exports = async function forgot(req, res)  {
    try{

        const {email} = req.body
        if (!email) {
            return res.status(400).json ({message: 'auth.error.resetPasswordError' })
        } else {
            res.send ({message: 'auth.resetPasswordSend' })
        }

        const user = await User.findOne({email: email, emailVerified: true})
        if (user) {
            const passwordResetToken = require('crypto').randomBytes(16).toString('hex')
            const passwordResetTokenExpiresAt = Date.now() + 30 * 60 * 1000
            
            user.passwordResetToken = passwordResetToken
            user.passwordResetTokenExpiresAt = passwordResetTokenExpiresAt
            await user.save()

            //тут отправить email
            sendEmail(
                user.email, 
                config.emailTemplateReset, 
                {
                    URL: config.clientUrl + '/reset?token=' + passwordResetToken,
                    site: config.clientUrl
                }
            )
        }

    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message);
        }
      
        console.error(error);
        return res.status(500).send(error.message);
    }
}
