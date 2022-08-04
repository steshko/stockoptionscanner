const User = require('../../database/models/User')
const Spread = require('../../database/models/Spread')
const config = require('../../config')()

module.exports = async function bestSpreadsPut(req, res)  {
    try{

        const maxDaysToExp = config.best.maxDaysToExp
        const INTEREST = config.best.spreads.minInterest
        const DISCOUNT = config.best.spreads.minDiscount
        const AMOUNT = config.best.spreads.minAmount

        // const spreadsList = await Spread
        // .find({
        //     type: "put",
        //     daysToExp: {$lt : maxDaysToExp},
        //     discount: {$gt : DISCOUNT},
        //     interest: {$gt : INTEREST},
        //     res: {$gt : AMOUNT},
        // })

        const spreadsList = await Spread.aggregate([
            {$match: { 
                type: "put",
                daysToExp: {$lt : maxDaysToExp},
                discount: {$gt : DISCOUNT},
                interest: {$gt : INTEREST},
                res: {$gt : AMOUNT},
            }},
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
                underPrice: 1,
                change: 1,
                percentChange: 1,

                strikeLow: 1,
                strikeHight: 1,
                strikeNum: 1,

                lowBid: 1,
                lowAsk: 1,
                hightBid: 1,
                hightAsk: 1,

                interest: 1,
                discount: 1,

                res: 1,
                resP: 1,
                resPrc: 1,
                resPrcP: 1,

                updatedAt: 1,
                weight: {$sum: [ {$multiply: ["$discount", 2 ]}, "$interest"] }
            }},
            { $sort: { weight: -1} }
        ])

        const data = spreadsList
        .filter( el => {
            let strikeLow = 0
            strikeLow = spreadsList
            .filter(f => f.symbol=== el.symbol && f.expDate === el.expDate )
            .sort((a, b) => b.discount - a.discount)[0].strikeLow

            return (el.strikeLow === strikeLow)
        })

        return res.json(data)

    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message);
        }
      
        console.error(error);
        return res.status(500).send(error.message);
    }
}
