const User = require('../../database/models/User')

module.exports = async function changeEmail(req, res)  {
    try{
        const {auth, userName} = req.user

        const user = await User.findOne({userName: userName})
        if (!user) {
            return res.status(400).json ({message: 'auth.error.authRequired' })
        }
        const index = user.industryColor.findIndex(industry => industry.industry === req.body.industry)
        if (index >= 0) {
            user.industryColor[index].color = req.body.color
        } else {
            user.industryColor.push({industry: req.body.industry, color: req.body.color})
        }
        await user.save()

        return res.json(user.industryColor)

    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message)
        }
        return res.status(500).send(error.message)
    }
}
