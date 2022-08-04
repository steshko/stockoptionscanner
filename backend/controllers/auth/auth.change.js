const User = require('../../database/models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = async function change(req, res)  {
    try{
        const {auth, userName} = req.user
        const {password, newPassword} = req.body

        const user = await User.findOne({userName: userName})
        if (!user) {
            return res.status(400).json({message: 'auth.error.login'})            
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json ({message: 'auth.error.currentPassword'})
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 12)
        user.password = hashedNewPassword
        user.save()
        return res.json(user)

    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message);
        }
      
        console.error(error);
        return res.status(500).send(error.message);
    }
}
