const User = require('../../database/models/User')

module.exports = async function userExists(req, res)  {
    try{

        const findUserName = req.query.userName

        if (!findUserName) {
            return res.status(404).send('not found')
        }
        const user = await User.findOne({userName: findUserName})

        if (!user){
            return res.status(404).send('not found')
        } else {
            return res.end('user found')
        }


    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message);
        }
      
        console.error(error);
        return res.status(500).send(error.message);
    }
}
