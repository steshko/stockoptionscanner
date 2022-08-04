const ServerLog = require('../../database/models/ServerLog')
// const Stock = require('../../database/models/Stock')

module.exports = async function serverLog(req, res)  {
    try{
        // const dis = await Stock.distinct("sector").sort()
        // console.log(dis)

        const result = await ServerLog.find({}).sort({ date: -1 })

        return res.json(result)

    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message);
        }
      
        console.error(error);
        return res.status(500).send(error.message);
    }
}
