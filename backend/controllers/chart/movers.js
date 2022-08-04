const User = require('../../database/models/User')
const TopList = require('../../database/models/TopList')
const config = require('../../config')()


module.exports = async function movers(req, res)  {
    try{

        const gainers = await TopList.findOne({report: 'gainers'}).sort({date: -1})
        const losers = await TopList.findOne({report: 'losers'}).sort({date: -1})

        return res.json({gainers: gainers?.list, losers: losers?.list})

        // const gainersNYSE = gainers.list.filter( el => el.code === 'NYSE')
        // const losersNYSE = losers.list.filter( el => el.code === 'NYSE')
        // const gainersNSDQ = gainers.list.filter( el => el.code === 'NASDAQ')
        // const losersNSDQ = losers.list.filter( el => el.code === 'NASDAQ')

        // const dataNYSE = []

        // for (let i=0; i<15; i++) {
        //     if (gainersNYSE.length > i && losersNYSE.length > i ) {
        //         dataNYSE.push({
        //             gainer: gainersNYSE[i],
        //             loser: losersNYSE[i]
        //         })
        //     }
        // }

        // const dataNSDQ = []

        // for (let i=0; i<15; i++) {
        //     if (gainersNSDQ.length > i && losersNSDQ.length > i ) {
        //         dataNSDQ.push({
        //             gainer: gainersNSDQ[i],
        //             loser: losersNSDQ[i]
        //         })
        //     }
        // }


        // const maxDaysToExp = config.best.maxDaysToExp
        // const INTEREST = config.best.covered.minInterest
        // const DISCOUNT = config.best.covered.minDiscount

        // const coveredList = await Covered.aggregate([
        //     {$match: { 
        //         daysToExp: {$lt : maxDaysToExp},
        //         discount: {$gt : DISCOUNT},
        //         interest: {$gt : INTEREST}
        //     }},
        //     {$lookup: {
        //         from: "stocks",
        //         localField: "symbol",
        //         foreignField: "symbol",
        //         as: "company"
        //     }},
        //     {$unwind: { path: "$company", preserveNullAndEmptyArrays: true}},
        //     {$project: {
        //         _id: 1,
        //         symbol: 1,
        //         companyName: "$company.name",
        //         sector: "$company.sector",
        //         industry: "$company.industry",
        //         quoteType: "$company.quoteType",
        //         expDate: 1,
        //         daysToExp: 1,
        //         calcMargineInt: 1,
        //         strikePrice: 1,
        //         strikeNum: 1,
        //         bid: 1,
        //         ask: 1,
        //         mid: 1,
        //         netDebitBid: 1,
        //         netDebitAsk: 1,
        //         netDebitMid: 1,
        //         underPrice: 1,
        //         change: 1,
        //         percentChange: 1,
        //         interest: 1,
        //         discount: 1,
        //         updatedAt: 1,
        //         weight: {$sum: [ {$multiply: ["$discount", 2 ]}, "$interest"] }
        //     }},
        //     { $sort: { weight: -1} }
        // ])

        // const data = coveredList
        // .filter( el => {
        //     let strikeDown = - 1
        //     strikeDown = coveredList
        //     .filter(f => f.symbol=== el.symbol && f.expDate === el.expDate )
        //     .sort((a, b) => b.discount - a.discount)[0].strikeNum

        //     return (el.strikeNum === strikeDown)
        // })

        // return res.json(data)

    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message);
        }
      
        console.error(error);
        return res.status(500).send(error.message);
    }
}
