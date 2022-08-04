const User = require('../database/models/User')

module.exports = async function useProps(userName)  {
    try{

        let user = {}

        if (userName) user = await User.findOne({userName: userName})
        
        return {
            calcYield: user.calcYield || 100, 
            minStockPrice: user.minStockPrice || 0, 
            maxStockPrice: user.maxStockPrice || 999999, 
            marginInterest: user.marginInterest || 10, 
        }

    } catch( error ) {
        console.error(error);
    }
}
