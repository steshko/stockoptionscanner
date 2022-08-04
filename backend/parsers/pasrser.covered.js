//const axios = require('axios')
const Covered = require('../database/models/Covered')
const ToParce = require('../database/models/ToParce')
// const deals = require('./parser.deals')
const config = require('../config')()
//const e = require('express')

function dateStr(day, month, year, daysToExp) {
    let monthNumber = ''
    switch(month) {
        case 'Jan' : monthNumber = '01'; break;
        case 'Feb' : monthNumber = '02'; break;
        case 'Mar' : monthNumber = '03'; break;
        case 'Apr' : monthNumber = '04'; break;
        case 'May' : monthNumber = '05'; break;
        case 'Jun' : monthNumber = '06'; break;
        case 'Jul' : monthNumber = '07'; break;
        case 'Aug' : monthNumber = '08'; break;
        case 'Sep' : monthNumber = '09'; break;
        case 'Oct' : monthNumber = '10'; break;
        case 'Nov' : monthNumber = '11'; break;
        case 'Dec' : monthNumber = '12'; break;
    }
    return year + '-' + monthNumber + '-' + (day<10 ? '0' + day : day) + ':' + daysToExp
}

async function covered(symbol, response, save) {
    try {

        const ITM_INTEREST = config.covered.itmInterest
        const ITM_DEEP_INTEREST = config.covered.itmDeepInterest
        const OTM_INTEREST = config.covered.otmInterest
        const ITM_DEEP_STRIKE_RATE = config.covered.itmDeepStrikeRate

        let chain = []
        let underPrice = response.data.underlying.last

        response.data.monthlyStrategyList.forEach(data => {
            const expDate = dateStr(data.day, data.month, data.year, data.daysToExp)
            const daysToExp = data.daysToExp
            data.optionStrategyList.forEach(data => {
                if (data.primaryLeg.description.indexOf('(ns)') < 0 &&
                    data.primaryLeg.bid > 0 &&
                    data.primaryLeg.ask > 0 &&
                    data.strategyAsk <= data.primaryLeg.strikePrice * 1.005
                ) {
                    chain.push({
                        symbol: symbol,
                        expDate: expDate,
                        strikePrice: data.primaryLeg.strikePrice,
                        daysToExp:daysToExp,
                        bid: data.primaryLeg.bid,
                        ask: data.primaryLeg.ask,
                        mid: ((data.primaryLeg.bid + data.primaryLeg.ask) / 2),
                        netDebitBid: data.strategyBid,
                        netDebitAsk: data.strategyAsk,
                        netDebitMid: ((data.strategyAsk - data.strategyBid) * 0.6 + data.strategyBid)
                    })                
                }
            })

        })

        chain.forEach( el => {
            el.underPrice = underPrice
            const margin = (el.strikePrice * 0.1 /365 * (el.daysToExp + 5))
            el.calcMargineInt = margin

            if (el.strikePrice <= underPrice) {
                el.interest = ((el.strikePrice - el.netDebitMid - margin)/el.netDebitMid*365/(el.daysToExp+3)*100)
                el.discount = ((1 - el.strikePrice/underPrice) * 100)
    
                el.minInterest = ((el.strikePrice - el.netDebitAsk - margin)/el.netDebitAsk*365/(el.daysToExp+3)*100)
                el.minDiscount = ((1 - el.strikePrice/underPrice) * 100)
            }
            if (el.strikePrice >= underPrice) {
                el.otm_interest = el.mid / el.underPrice * 365 / el.daysToExp * 100
            }
            el.pubReturn = ((el.strikePrice - el.netDebitAsk)/el.netDebitAsk*100)
            el.pubInterest = el.daysToExp > 0
                ? ((el.strikePrice - el.netDebitAsk)/el.netDebitAsk*365/(el.daysToExp+3)*100)
                : ((el.strikePrice - el.netDebitAsk)/el.netDebitAsk *100)

            el.strikeNum = el.strikePrice < underPrice
                ? - chain.filter( ch => (
                    ch.daysToExp === el.daysToExp && 
                    ch.strikePrice > el.strikePrice &&
                    ch.strikePrice < underPrice
                )).length - 1
                : chain.filter( ch => (
                    ch.daysToExp === el.daysToExp && 
                    ch.strikePrice < el.strikePrice &&
                    ch.strikePrice > underPrice
                )).length + 1
        })

        if (save) {
            await Covered.deleteMany({ symbol: symbol}).exec()
            try {
                await Covered.insertMany(chain
                    .filter( el => (
                        el.netDebitBid > 0 && 
                        el.netDebitAsk > 0 && 
                        el.netDebitAsk <= el.strikePrice &&
                        el.strikeNum < 3 &&
                        (
                            (
                                (underPrice - el.bid)/el.netDebitAsk > 0.6 
                                &&
                                (underPrice - el.bid)/el.netDebitAsk < 1.4 
                                &&
                                (underPrice - el.ask)/el.netDebitBid > 0.6 
                                &&
                                (underPrice - el.ask)/el.netDebitBid < 1.4 
                            )
                            || 
                            el.strikeNum > 0
                        ) &&
                        (el.interest < 1000 || el.strikeNum > 0) &&
                        (
                            (
                                (el.strikePrice / underPrice < ITM_DEEP_STRIKE_RATE 
                                    && 
                                el.interest >= ITM_DEEP_INTEREST)
                                ||
                                (el.strikePrice / underPrice >= ITM_DEEP_STRIKE_RATE 
                                    && 
                                el.interest >= ITM_INTEREST)
                                // (el.strikeNum < -1 && el.interest >= ITM_DEEP_INTEREST)
                                // ||
                                // (el.strikeNum === -1 && el.interest >= ITM_INTEREST)
                            ) 
                            ||
                            (
                                el.strikeNum > 0 
                                &&
                                el.otm_interest >= OTM_INTEREST 
                                &&
                                el.mid >= el.underPrice * 0.03
                            )         
                        )           
                    ))
                    .map( el => (
                        {
                            symbol: el.symbol,
                            expDate: el.expDate, 
                            daysToExp: el.daysToExp,
                            calcMargineInt: el.calcMargineInt,
                            strikePrice: el.strikePrice,
                            bid: el.bid.toFixed(2),
                            ask: el.ask.toFixed(2),
                            mid: el.mid.toFixed(2),
                            netDebitBid: el.netDebitBid.toFixed(2),
                            netDebitAsk: el.netDebitAsk.toFixed(2),
                            netDebitMid: el.netDebitMid.toFixed(2),
                            underPrice: el.underPrice.toFixed(2),
                            change: response.data.underlying.change,
                            percentChange: response.data.underlying.percentChange,        
                            interest: el.interest ? el.interest.toFixed(2) : undefined,
                            discount: el.discount ? el.discount.toFixed(2) : undefined,
                            otm_interest: el.otm_interest ? el.otm_interest.toFixed(2) : undefined,
                            strikeNum: el.strikeNum,
                        }
                    )), function(error, docs) {
                            const date = new Date
                            if (docs && docs.length > 0) {
                                const maxDiscount = docs.sort((a, b) => b.discount - a.discount)[0].discount
                                ToParce.updateOne(
                                    {symbol: symbol}, 
                                    {lastFound: date, lastCalc: date, maxDiscount: maxDiscount}, 
                                    {upsert: true}, 
                                    (err, r)=>{})
                            } else {
                                ToParce.updateOne(
                                    {symbol: symbol}, 
                                    {lastCalc: date, maxDiscount: null}, 
                                    {upsert: true}, 
                                    (err, r)=>{})
                            }
                        }
                )
            } catch (e) {
                console.log (e);
            }
        }

        return ( {success: true, coveredChain: chain} )

    } catch(e) {
        console.log(e.message)
        return {message: e.message}
    }
}



module.exports = covered
