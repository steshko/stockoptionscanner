const chain = require('../../mining/chain')
const isMarketOpen = require('../api/api.ismarketopen')()

module.exports = async function coveredIn(req, res)  {
    try{

        const { auth, userName, roles, userId} = req.user
        const {symbol} = req.query

        // const save = isMarketOpen()

        const result = await chain(symbol, isMarketOpen)

        if (!result.success) {
            return res.status(500).send({message: result.message })
        } else {
            return res.json(result)
        }

    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message);
        }
      
        console.error(error);
        return res.status(500).send(error.message)
    }
}
