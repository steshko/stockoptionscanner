const User = require('../../database/models/User')

module.exports = async function token(req, res)  {
    
    try{
        const { auth, email, roles, userId, emailVerified} = req.user

        if (auth) {

            const user = await User.findOne({email: email, disabled: false})
            if (user) {
                return res.json({
                    userId: userId, 
                    email: user.email,
                    emailVerified: user.emailVerified,
                    roles: user.roles,
                    industryColor: user.industryColor,
                    calcYield: user.calcYield,
                    minStockPrice: user.minStockPrice,
                    maxStockPrice: user.maxStockPrice,
                    marginInterest: user.marginInterest,
                })
            }


        } else {
            return res.status(401).send('unauthorized');
        }

    } catch(error) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message);
        }
      
        console.error(error);
        return res.status(500).send(error.message);
    }

}
  