const Spread = require('../database/models/Spread')
const ToParce = require('../database/models/ToParce')
const config = require('../config')()

function round(num) { return Math.round(num * 100) / 100 }

async function saveSpreadCall(result, symbol, marketData) {

    try {

        await Spread.deleteMany({ symbol: symbol, type: "call"}).exec()


        await Spread.insertMany(result
            .filter( el => (
                el.discount >= config.spread.callDiscount 
                &&
                el.interest >= config.spread.callInterest
                &&
                el.resP > 0
                && 
                (
                    (el.strikeHight - el.strikeLow <= 1 && el.res >= config.spread.callAmountMin)
                    ||
                    (el.strikeHight - el.strikeLow > 1 && el.res >= config.spread.callAmountMax)
                )
            ))
            .map( el => (
                {
                    symbol: el.symbol,
                    expDate: el.expDate,
                    daysToExp: el.daysToExp,
                    calcMargineInt: 0,
                    type: 'call',
                    underPrice: el.lastPrice, //marketData.last,
                    change: marketData.change,
                    percentChange: marketData.percentChange,
                    strikeLow: el.strikeLow,
                    strikeHight: el.strikeHight,
                    strikeNum: 0,
                    lowBid: el.lowBid,
                    lowAsk: el.lowAsk,
                    hightBid: el.hightBid,
                    hightAsk: el.hightAsk,
                    discount: el.discount,
                    interest: el.interest,

                    res: el.res,
                    resP: el.resP
                }
            )), function(error, docs) {
                    const date = new Date
                    if (docs && docs.length > 0) {
                        const maxDiscount = docs.sort((a, b) => b.discount - a.discount)[0].discount
                        ToParce.updateOne(
                            {symbol: symbol}, 
                            {lastFound: date, lastCalc: date, maxDiscountSpread: maxDiscount}, 
                            {upsert: true}, 
                            (err, r)=>{})
                    } else {
                        ToParce.updateOne(
                            {symbol: symbol}, 
                            {lastCalc: date, maxDiscountSpread: null}, 
                            {upsert: true}, 
                            (err, r)=>{})
                    }
            }
        )
    } catch (e) {
        console.error (e);
    }
}

async function spreadCall(symbol, response, marketData, save) {
    try{

        let prevStrike = null, currentStrike = null
        let prevStrikeData = null, currentStrikeData = null
        const underPrice = marketData.last//response.data.underlyingPrice

        // console.log(underPrice)

        const result = []
        for (var date in response.data.callExpDateMap) {
            prevStrike = null, currentStrike = null
            prevStrikeData = null, currentStrikeData = null
            for (var strike in response.data.callExpDateMap[date]) {
                if (!response.data.callExpDateMap[date][strike][0].nonStandard) {
                    currentStrikeData = response.data.callExpDateMap[date][strike][0]
                    currentStrike = strike

                    if (prevStrike && prevStrike > underPrice && currentStrike > underPrice && prevStrike < currentStrike) {
                        if (prevStrikeData.bid && prevStrikeData.ask && currentStrikeData.bid && currentStrikeData.ask) {

                            result.push({
                                expDate: date,
                                daysToExp: currentStrikeData.daysToExpiration,
                                symbol: symbol,
                                lastPrice: underPrice,
                    
                                strikeLow: parseFloat(prevStrike),
                                strikeHight: parseFloat(currentStrike),

                                lowBid: prevStrikeData.bid,
                                lowAsk: prevStrikeData.ask,
                                hightBid: currentStrikeData.bid,
                                hightAsk: currentStrikeData.ask,
                        

                                buyP: currentStrikeData.ask,
                                sellP: prevStrikeData.bid,
                        
                                buy: round((currentStrikeData.bid + currentStrikeData.ask) / 2),
                                sell: round((prevStrikeData.bid + prevStrikeData.ask) / 2 ),

                                resP: round(prevStrikeData.bid - currentStrikeData.ask) ,
                                res: round(((prevStrikeData.bid + prevStrikeData.ask) / 2 ) - ((currentStrikeData.bid + currentStrikeData.ask) / 2))

                            })
                        }
                    }
                    prevStrikeData = currentStrikeData
                    prevStrike = currentStrike
                }
            }
        }

        result.forEach(el => {
            el.discount = round((el.strikeLow - el.lastPrice) / el.lastPrice * 100)
            el.interest = round(el.res/(el.strikeHight - el.strikeLow)*365/(el.daysToExp + 3) * 100) 
        })

        if (save) {
            saveSpreadCall(result, symbol, marketData)
        }
        
        return ( {success: true, spreadCallChain: result} )

    } catch(e) {
        console.error(e.message)
        return {message: e.message}
    }
}

module.exports = spreadCall
