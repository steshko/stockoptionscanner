const axios = require('axios')
const Spread = require('../database/models/Spread')
const ToParce = require('../database/models/ToParce')
const Condor =  require('../database/models/Condor')

async function findCondor (arrCall, arrPut, condor, underPrice)  {
    arrCall.forEach(call => {
        arrPut
        .filter(put => put.expDate === call.expDate && call.strikeLow > put.strikeHight) 
        .forEach(put => {
                const amount = put.putRes + call.callRes
                const callDiff = call.strikeHight - call.strikeLow
                const putDiff = put.strikeHight - put.strikeLow
                const diff = callDiff > putDiff ? callDiff : putDiff
                if (amount / diff >= 1.2) {
                    condor.push({
                        expDate: call.expDate,
                        underPrice: underPrice,
                        callStrikeLow : call.strikeLow,
                        callStrikeHight : call.strikeHight,
                        putStrikeLow : put.strikeLow,
                        putStrikeHight : put.strikeHight,
                        call: call.callRes,
                        put:put.putRes,
                        callP: call.callResP,
                        putP:put.putResP,
                        strikeDiff: diff,
                        diff: amount / diff,
                        diffP: (put.putResP + call.callResP) / diff,
                        callDiscount: (underPrice - put.strikeHight )/underPrice * 100,
                        putDiscount: (call.strikeLow - underPrice )/underPrice * 100
                    })
                }
            })
    })
}

async function calcPair (result, date, prevStrike, prevStrikeData, currentStrike, currentStrikeData) {
    result.push({
        expDate: date,
        daysToExp: currentStrikeData.daysToExpiration,
        strikeLow: prevStrike,
        strikeHight: currentStrike,
        discount: null,

        lowBid: prevStrikeData.bid,
        lowAsk: prevStrikeData.ask,
        hightBid: currentStrikeData.bid,
        hightAsk: currentStrikeData.ask,

        callBuyP: currentStrikeData.ask > 0 && currentStrikeData.bid > 0 ? currentStrikeData.ask : null,
        callSellP: prevStrikeData.bid > 0 && prevStrikeData.ask > 0 ? prevStrikeData.bid : null,

        callBuy: currentStrikeData.ask > 0 && currentStrikeData.bid > 0 ? (currentStrikeData.bid + currentStrikeData.ask) / 2 : null,
        callSell: prevStrikeData.bid > 0 && prevStrikeData.ask > 0 ? (prevStrikeData.bid + prevStrikeData.ask) / 2 : null,

        callResP: null,
        callResPrcP: null,

        callRes: null,
        callResPrc: null,
    
        putBuyP: null,
        putSellP: null,

        putBuy: null,
        putSell: null,

        putResP: null,
        putResPrcP: null,

        putRes: null,
        putResPrc: null,
    })
}

async function saveSpread(result, symbol, marketData) {

    const SPREAD_DISCOUNT = process.env.SPREAD_DISCOUNT || 15
    const SPREAD_PREMIUM = process.env.SPREAD_PREMIUM || 5
    const SPREAD_AMOUNT = process.env.SPREAD_PREMIUM || 0.05

    await Spread.deleteMany({ symbol: symbol}).exec()

    try {
        await Spread.insertMany(result
            .filter( el => (
                (
                    (el.callResPrc && el.callResPrc >= SPREAD_PREMIUM) 
                    || 
                    (el.putResPrc && el.putResPrc >= SPREAD_PREMIUM)
                ) 
                && 
                (
                    el.callRes >= SPREAD_AMOUNT
                    || 
                    el.putRes >= SPREAD_AMOUNT
                )
                &&
                el.discount >= SPREAD_DISCOUNT 
                &&
                (
                    (el.callResP >= 0 && el.putResP >= 0)
                )
            ))
            .map( el => (
                {
                    symbol: el.symbol,
                    expDate: el.expDate,
                    daysToExp: el.daysToExp,
                    calcMargineInt: 0,
                    type: el.callRes > 0 ? 'call' : 'put',
                    underPrice: marketData.last,
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

                    res: el.callRes > 0 ? el.callRes : el.putRes,
                    resP: el.callRes > 0 ? el.callResP : el.putResP,
                    resPrc: el.callRes > 0 ? el.callResPrc : el.putResPrc,
                    resPrcP: el.callRes > 0 ? el.callResPtcP : el.putResPrcP,
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
        console.log (e);
    }

}

async function saveCondor(result, symbol, marketData) {

    // const SPREAD_DISCOUNT = process.env.SPREAD_DISCOUNT || 20
    // const SPREAD_PREMIUM = process.env.SPREAD_PREMIUM || 5
    // const SPREAD_AMOUNT = process.env.SPREAD_PREMIUM || 0.05

    await Condor.deleteMany({ symbol: symbol}).exec()

    try {
        await Condor.insertMany(result
            .filter( el => ( el.diffP > 0.5 && el.putDiscount > 5 && el.callDiscount > 5))
            .map( el => (
                {
                    symbol: el.symbol,
                    expDate: el.expDate,
                    calcMargineInt: 0,
                    underPrice: el.underPrice,
                    callStrikeLow: el.callStrikeLow,
                    callStrikeHight: el.callStrikeHight,
                    putStrikeLow: el.putStrikeLow,
                    putStrikeHight: el.putStrikeHight,

                    call: el.call,
                    put: el.put,
                    callP: el.callP,
                    putP: el.putP,
                                    
                    strikeDiff: el.strikeDiff,
                    diff: el.diff,
                    diffP: el.diffP,

                    putDiscount: el.putDiscount,
                    callDiscount: el.callDiscount

                }
            )), function(error, docs) {
                    const date = new Date
                    if (docs && docs.length > 0) {
                        const maxDiff = docs.sort((a, b) => b.diff - a.diff)[0].diff
                        ToParce.updateOne(
                            {symbol: symbol}, 
                            {lastFound: date, lastCalc: date, maxDiffCondor: maxDiff}, 
                            {upsert: true}, 
                            (err, r)=>{})
                    } else {
                        ToParce.updateOne(
                            {symbol: symbol}, 
                            {lastCalc: date, maxDiffCondor: null}, 
                            {upsert: true}, 
                            (err, r)=>{})

                    }

            }
        )

    } catch (e) {
        console.log (e);
    }

}

async function spread(symbol, response, marketData, save) {
    try{

        let prevStrike = null, currentStrike = null
        let prevStrikeData = null, currentStrikeData = null
        const underPrice = response.data.underlyingPrice

        const result = []
        for (var date in response.data.callExpDateMap) {
            for (var strike in response.data.callExpDateMap[date]) {
                if (!response.data.callExpDateMap[date][strike][0].nonStandard) {
                    currentStrikeData = response.data.callExpDateMap[date][strike][0]
                    currentStrike = strike
                    if (prevStrike !== null) {
                        await calcPair(result, date, prevStrike, prevStrikeData, currentStrike, currentStrikeData)
                    }
                    prevStrikeData = currentStrikeData
                    prevStrike = currentStrike
                }
            }
        }

        result.forEach( el => {
            el.strikeLow = parseFloat(el.strikeLow)
            el.strikeHight = parseFloat(el.strikeHight)

            el.symbol = symbol
            el.lastPrice = response.data.underlyingPrice

            if (el.strikeLow = 15, el.expDate === '2021-02-19:1') {
                console.log(el)
            }
            // console.log(el)

            //цена выше чем верхний страйк - put spreads
            if (response.data.underlyingPrice > parseFloat(el.strikeHight)) {

                if (response.data.putExpDateMap[el.expDate][el.strikeLow] &&
                    response.data.putExpDateMap[el.expDate][el.strikeHight]) {
                    el.putBuy = response.data.putExpDateMap[el.expDate][el.strikeLow][0].bid > 0
                        ?(response.data.putExpDateMap[el.expDate][el.strikeLow][0].bid +
                        response.data.putExpDateMap[el.expDate][el.strikeLow][0].ask) / 2
                        :null
                    el.putSell = response.data.putExpDateMap[el.expDate][el.strikeHight][0].bid > 0
                        ?(response.data.putExpDateMap[el.expDate][el.strikeHight][0].bid +
                        response.data.putExpDateMap[el.expDate][el.strikeHight][0].ask) / 2
                        :null

                    el.putBuyP = response.data.putExpDateMap[el.expDate][el.strikeLow][0].bid > 0
                        ?response.data.putExpDateMap[el.expDate][el.strikeLow][0].ask
                        :null
                    el.putSellP = response.data.putExpDateMap[el.expDate][el.strikeHight][0].bid > 0
                        ?response.data.putExpDateMap[el.expDate][el.strikeHight][0].bid
                        :null

                    el.lowBid = response.data.putExpDateMap[el.expDate][el.strikeLow][0].bid
                    el.lowAsk = response.data.putExpDateMap[el.expDate][el.strikeLow][0].ask
                    el.hightBid = response.data.putExpDateMap[el.expDate][el.strikeHight][0].bid
                    el.hightAsk = response.data.putExpDateMap[el.expDate][el.strikeHight][0].ask
                                        

                }    

                el.putResP = el.putSellP > 0 && el.putBuyP > 0 ? el.putSellP - el.putBuyP : null
                el.putRes = el.putSell > 0 && el.putBuy > 0 ? el.putSell - el.putBuy : null
                el.putResPrc = el.putRes > 0 ? (el.putSell - el.putBuy) / (el.strikeHight - el.strikeLow) * 100 : null
                el.discount = (response.data.underlyingPrice - el.strikeHight) / response.data.underlyingPrice * 100
                el.interest = el.putRes/(el.strikeHight - el.strikeLow)*365/(el.daysToExp+3)*100
        
            } 
            //цена выше чем нижний страйк???
            if (response.data.underlyingPrice < parseFloat(el.strikeLow)) {
                el.callResP = el.callSellP > 0 && el.callBuyP > 0 ? el.callSellP - el.callBuyP : null
                el.callRes = el.callSell > 0 && el.callBuy > 0 ? el.callSell - el.callBuy : null
                el.callResPrcP = el.callResP > 0 ? (el.callSellP - el.callBuyP) / (el.strikeHight - el.strikeLow) * 100 : null
                el.callResPrc = el.callRes > 0 ? (el.callSell - el.callBuy) / (el.strikeHight - el.strikeLow) * 100 : null
                el.discount = (el.strikeLow - response.data.underlyingPrice) / response.data.underlyingPrice * 100        
                el.interest = el.callRes/(el.strikeHight - el.strikeLow)*365/(el.daysToExp+3)*100

                if (el.strikeLow === 3 && el.expDate === '2021-02-19:1') {
                    console.log(el)
                }

            }
            // //цена выше чем нижний страйк???
            // if (response.data.underlyingPrice > parseFloat(el.strikeLow)) {
            //     el.callBuy = null
            //     el.callSell = null
            //     el.callBuyP = null
            //     el.callSellP = null
            // } else {
            //     el.callResP = el.callSellP > 0 && el.callBuyP > 0 ? el.callSellP - el.callBuyP : null
            //     el.callRes = el.callSell > 0 && el.callBuy > 0 ? el.callSell - el.callBuy : null
            //     el.callResPrcP = el.callResP > 0 ? (el.callSellP - el.callBuyP) / (el.strikeHight - el.strikeLow) * 100 : null
            //     el.callResPrc = el.callRes > 0 ? (el.callSell - el.callBuy) / (el.strikeHight - el.strikeLow) * 100 : null
            //     el.discount = (el.strikeLow - response.data.underlyingPrice) / response.data.underlyingPrice * 100        
            //     el.interest = el.callRes/(el.strikeHight - el.strikeLow)*365/(el.daysToExp+3)*100
            // }
    
            el.strikeLow = parseFloat(el.strikeLow)
            el.strikeHight = parseFloat(el.strikeHight)

            el.symbol = symbol
            el.lastPrice = response.data.underlyingPrice

            // if (el.strikeLow === 3 && el.expDate === '2021-02-19:1') {
            //     console.log(el)
            // }

        })

        //condor
        const condor = []
        const call = result.filter( el => el.callRes > 0)

        const put = result.filter( el => el.putRes > 0)

        await findCondor(call, put, condor, underPrice)
        
        result.sort((a, b) => {//if (a.expDate > b.expDate) {return 1} else {return -1}})
            return (
                a.expDate === b.expDate 
                ? a.discount > b.discount 
                    ? -1
                    : 1
                : a.expDate > b.expDate 
                ? 1
                : -1
            )
        })
        condor.sort((a, b) => {if (a.diffP < b.diffP) {return 1} else {return -1}})

        if (save) {
            saveSpread(result, symbol, marketData)
            saveCondor(condor, symbol, marketData)
        }


        return ( {success: true, spreadChain: result, condor: condor} )

    } catch(e) {
        console.log(e.message)
        return {message: e.message}
    }
}

module.exports = spread
