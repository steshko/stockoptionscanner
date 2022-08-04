const User = require('../../database/models/User')
const Covered = require('../../database/models/Covered')
const config = require('../../config')()


module.exports = async function bestCovered(req, res)  {
    try{

        const maxDaysToExp = config.best.maxDaysToExp
        const INTEREST = config.best.covered.minInterest
        const DISCOUNT = config.best.covered.minDiscount

        // const coveredList = await Covered
        // .find({
        //     daysToExp: {$lt : maxDaysToExp},
        //     discount: {$gt : DISCOUNT},
        //     interest: {$gt : INTEREST}
        // })

        const coveredList = await Covered.aggregate([
            {$match: { 
                daysToExp: {$lt : maxDaysToExp},
                discount: {$gt : DISCOUNT},
                interest: {$gt : INTEREST}
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
                calcMargineInt: 1,
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
                interest: 1,
                discount: 1,
                updatedAt: 1,
                weight: {$sum: [ {$multiply: ["$discount", 2 ]}, "$interest"] }
            }},
            { $sort: { weight: -1} }
        ])

        const data = coveredList
        .filter( el => {
            let strikeDown = - 1
            strikeDown = coveredList
            .filter(f => f.symbol=== el.symbol && f.expDate === el.expDate )
            .sort((a, b) => b.discount - a.discount)[0].strikeNum

            return (el.strikeNum === strikeDown)
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
