const ToParce = require('../../database/models/ToParce')

module.exports = async function serverLog(req, res)  {
    try{

        const today = new Date()

        today.setUTCHours(0, 0, 0, 0)
        const result = await ToParce.find({lastCalc: {$gt: today}}).sort({ lastCalc: -1 })

        return res.json(result)

    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message);
        }
      
        console.error(error);
        return res.status(500).send(error.message);
    }
}
