const User = require('../../database/models/User')
const Spread = require('../../database/models/Spread')

// const INTEREST = 70
//const DISCOUNT = 15

module.exports = async function spreadCall(req, res)  {
    try{

        const { auth, userName, roles, userId} = req.user
        const {exp, discount} = req.query

        let {calcYield, minStockPrice, maxStockPrice, marginInterest} = await require('../userProps')(userName)

        const spread = await Spread.aggregate([
            {$match: { 
                expDate: exp,
                type: "call",
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
                from: 'spreads',
                let: { symbol: "$symbol", expDate: "$expDate" },
                pipeline: [
                  {$match: 
                    {$expr: {
                      $and: [
                        {$eq: ["$type", "call"]},
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
                underPrice: "$strikes.underPrice",
                change: "$strikes.change",
                percentChange: "$strikes.percentChange",

                strikeLow: "$strikes.strikeLow",
                strikeHight: "$strikes.strikeHight",
                strikeNum: "$strikes.strikeNum",

                lowBid: "$strikes.lowBid",
                lowAsk: "$strikes.lowAsk",
                hightBid: "$strikes.hightBid",
                hightAsk: "$strikes.hightAsk",

                interest: "$strikes.interest",
                discount: "$strikes.discount",

                res: "$strikes.res",
                resP: "$strikes.resP",
                resPrc: "$strikes.resPrc",
                resPrcP: "$strikes.resPrcP",

                updatedAt: "$strikes.updatedAt",
                weight: {$sum: [ {$multiply: ["$strikes.discount", 2 ]}, "$strikes.interest"] }
            }},
            { $sort: { weight: -1} }
        ])

        if (spread.length === 0) {
            const records = await Spread.countDocuments({}).exec()
            if (records < 100) {
                return res.json({prepareMode: true})
            }
        }

        return res.json(spread)

    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message);
        }
      
        console.error(error);
        return res.status(500).send(error.message);
    }
}
