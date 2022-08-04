const User = require('../../database/models/User')
const EmailHistory = require('../../database/models/EmailHistory')
const sendEmail = require('../sendGridEmail')
const config = require('../../config')()

module.exports = async function changeEmail(req, res)  {
    try{
        const {auth, userName} = req.user

        const user = await User.findOne({userName: userName})
        if (!user) {
            return res.status(400).json ({message: 'auth.error.authRequired' })
        }
        if (!user.emailVerified) {
            const emailVerificationToken = require('crypto').randomBytes(16).toString('hex')
            const emailVerificationTokenExpiresAt = Date.now() + 24 * 30 * 60 * 60 * 1000

            user.emailVerificationToken = emailVerificationToken,
            user.emailVerificationTokenExpiresAt = emailVerificationTokenExpiresAt,

            await user.save()

            await sendEmail(
                user.email, 
                config.emailTemplateChangeEmail, 
                {
                    URL: config.clientUrl + '/confirm?token=' + emailVerificationToken,
                    site: config.clientUrl
                }
            )
        }

        return res.json(user)

    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message)
        }
        return res.status(500).send(error.message)
    }
}
