const User = require('../../database/models/User')

module.exports = async function confirm(req, res)  {
    try{

        const {token} = req.body
        if (!token) {
            return res.status(400).json ({message: 'auth.error.confirmEmailTokenNotPresent' })
        }

        const date = new Date
        const user = await User.findOne({
            emailVerified: false,
            emailVerificationToken: token, 
            emailVerificationTokenExpiresAt: {$gt: date}
        })

        if (user) {
            user.emailVerified = true
            await user.save()

            return res.send({email: user.email, userName: user.userName});

        } else {
            return res.status(400).json ({message: 'auth.error.confirmEmailTokenNotFound' })
        }

    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message);
        }
      
        console.error(error);
        return res.status(500).send(error.message);
    }
}
