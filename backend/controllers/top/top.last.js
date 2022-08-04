const TopList = require('../../database/models/TopList')
const parseTradingView = require('../../parsers/parser.tradingview');
const topByIndex = require('./top.byIndex')

module.exports = async function last(req, res)  {
    try{

        const { auth, userName, roles, userId} = req.user

        if (!req.query.report) {
            return res.status(500).send({message:'specify report type (rep_type=large-cap||losers||gainers||active||most-volatile||overbought||oversold)'})
        }

        let result = null
// console.log(req.user)
// console.log('before ')
        if (!roles || (roles && !roles.includes('master'))) {
            result = await TopList.findOne({report: req.query.report}).sort({date: -1})
        } else if (req.query.report === 'byIndex') {
            result = await topByIndex()    
        } else {
            // console.log('parseTradingView')
            result = await parseTradingView(req.query.report, true)    
        }
        // console.log('after', result)

        res.json(result)

    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message);
        }
      
        console.error(error);
        return res.status(500).send(error.message);
    }
}
