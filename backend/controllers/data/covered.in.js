const User = require('../../database/models/User')
const Covered = require('../../database/models/Covered')

const INTEREST = 70
//const DISCOUNT = 15

module.exports = async function coveredIn(req, res)  {
    try{

        const { auth, userName, roles, userId} = req.user
        const {exp, discount} = req.query

        let {calcYield, minStockPrice, maxStockPrice, marginInterest} = await require('../userProps')(userName)

        const covered = await Covered.aggregate([
            {$match: { 
                expDate: exp,
                strikeNum: {$lte : 0},
                discount: {$gte : Number(discount)},
                underPrice: {$gt : minStockPrice},
                underPrice: {$lt : maxStockPrice},
            }},
            {$group : {
                _id: {symbol: "$symbol", expDate: "$expDate"},
                symbol: { $first : "$symbol" },
                expDate: { $first : "$expDate" },   
            }},
            {$lookup: {
                from: 'covereds',
                let: { symbol: "$symbol", expDate: "$expDate" },
                pipeline: [
                  {$match: 
                    {$expr: {
                      $and: [
                        {$eq: ["$symbol", "$$symbol"]},
                        {$eq: ["$expDate", "$$expDate"]},
                        {$gte: ["$discount", Number(discount)] }
                      ]
                    }}
                  },
                  { $sort: { interest: -1} },
                  { $limit : 1 },
                ],  
                as: "strikes"
            }},
            {$unwind: { path: "$strikes"}},
            { $sort: { discount: 1} },
            { $limit : 100 },

            {$lookup: {
                from: "stocks",
                localField: "symbol",
                foreignField: "symbol",
                as: "company"
            }},
            {$unwind: { path: "$company", preserveNullAndEmptyArrays: true}},
            {$project: {
                _id: "$strikes._id",
                symbol: 1,
                companyName: "$company.name",
                sector: "$company.sector",
                industry: "$company.industry",
                quoteType: "$company.quoteType",
                expDate: 1,
                daysToExp: "$strikes.daysToExp",
                calcMargineInt: "$strikes.calcMargineInt",
                strikePrice: "$strikes.strikePrice",
                strikeNum: "$strikes.strikeNum",
                bid: "$strikes.bid",
                ask: "$strikes.ask",
                mid: "$strikes.mid",
                netDebitBid: "$strikes.netDebitBid",
                netDebitAsk: "$strikes.netDebitAsk",
                netDebitMid: "$strikes.netDebitMid",
                underPrice: "$strikes.underPrice",
                change: "$strikes.change",
                percentChange: "$strikes.percentChange",
                interest: "$strikes.interest",
                discount: "$strikes.discount",
                updatedAt: "$strikes.updatedAt",
                weight: {$sum: [ {$multiply: ["$strikes.discount", 2 ]}, "$strikes.interest"] }
            }},
            { $sort: { weight: -1} }
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
