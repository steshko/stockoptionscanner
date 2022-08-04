const Covered = require('../../database/models/Covered')

module.exports = async function coveredOut(req, res)  {
    try{

        const { auth, userName, roles, userId} = req.user

        const {exp, strike} = req.query
        const strikeNum = parseInt(strike)

        let {calcYield, minStockPrice, maxStockPrice, marginInterest} = await require('../userProps')(userName)

        const covered = await Covered.aggregate([
            {$match: { 
                expDate: exp,
                strikeNum: strikeNum,
                underPrice: {$gt : minStockPrice},
                underPrice: {$lt : maxStockPrice},
                // mid: {$gt : minStockPrice},
                // >= el.underPrice * 0.03
            }},
            // { $sort: { discount: 1} },
            // { $limit : 100 },

            {$lookup: {
                from: "stocks",
                localField: "symbol",
                foreignField: "symbol",
                as: "company"
            }},
            {$unwind: { path: "$company", preserveNullAndEmptyArrays: true}},
            {$project: {
                _id: 1,
                symbol: 1,
                companyName: "$company.name",
                sector: "$company.sector",
                industry: "$company.industry",
                quoteType: "$company.quoteType",
                expDate: 1,
                daysToExp: 1,
                // calcMargineInt: "$strikes.calcMargineInt",
                strikePrice: 1,
                strikeNum: 1,
                bid: 1,
                ask: 1,
                mid: 1,
                netDebitBid: 1,
                netDebitAsk: 1,
                netDebitMid: 1,
                underPrice: 1,
                change: 1,
                percentChange: 1,
                interest: "$otm_interest",
                updatedAt: 1
                // weight: {$sum: [ {$multiply: ["$strikes.discount", 2 ]}, "$strikes.interest"] }
            }},
            // { $sort: { weight: -1} }
        ])

        // covered.forEach(row => {
        //     row.calcMargineInt = (row.strikePrice * (marginInterest/100) /365 * (row.daysToExp + 5))
        //     row.calc = Math.floor((365*100* (row.strikePrice - row.calcMargineInt)/(calcYield * (row.daysToExp + 3) + 365 * 100))*100)/100
        // })
        if (covered.length === 0) {
            const records = await Covered.countDocuments({}).exec()
            if (records < 100) {
                return res.json({prepareMode: true})
            }
        }

        return res.json(covered)

    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message);
        }
      
        console.error(error);
        return res.status(500).send(error.message);
    }
}
