const axios = require('axios')
const Stock = require('../database/models/Stock')
const ToParce = require('../database/models/ToParce')
const parseSpread = require('../parsers/parser.spread')
const parseSpreadPut = require('../parsers/parser.spread.put')
const parseSpreadCall = require('../parsers/parser.spread.call')
const parseCovered = require('../parsers/pasrser.covered')
const parseProfile = require('../parsers/parser.yahoo').parseProfile


async function chain(symbol, save) {
    try{

        const apikey = process.env.ATAPIKEY

        let url = "https://api.tdameritrade.com/v1/marketdata/chains?apikey=" + apikey +
                    "&symbol=" + symbol + 
                    "&includeQuotes=TRUE" +
                    "&strategy=COVERED" +
                    "&optionType=S"


        let responseCovered = axios({url, method: 'GET'})

        url =  'https://api.tdameritrade.com/v1/marketdata/chains?apikey=' + apikey + 
                    '&symbol=' + symbol + 
                    '&strategy=SINGLE'

        let responseSingle = axios({url, method: 'GET'})

        const data = await Promise.all([responseCovered, responseSingle])

        if (!data[0].data || !data[1]) {
            return ( {success: false, message: 'chain.error.repeat'} )
        }

        if (data[0].data.status === 'FAILED') {
            ToParce.updateOne({symbol: symbol}, {forDelete: true}).exec()
            return ( {success: false, message: 'chain.error.repeat'} )
        }

        if (!data[0].data.monthlyStrategyList) {
            return ( {success: false, message:'!response.data.monthlyStrategyList'} )
        }

        let stock = await Stock.findOne( { symbol: symbol } )
        if (!stock || !stock.name) {
            stock = await parseProfile(symbol)
        }

        ToParce.updateOne({symbol: symbol}, {symbol: symbol}, {upsert: true}).exec()

        const marketData = {
            symbol: data[0].data.symbol,
            name: stock.name,
            sector: stock.sector,
            industry: stock.industry,
            quoteType: stock.quoteType,
            exchangeName: stock.exchangeName,

            change: data[0].data.underlying.change,
            percentChange: data[0].data.underlying.percentChange,
            last: data[0].data.underlying.last,
            totalVolume: data[0].data.underlying.totalVolume,
            exchangeName: data[0].data.underlying.exchangeName,
            delayed: data[0].data.underlying.delayed,
            timestamp: new Date()
        }

        const { coveredChain } = await parseCovered(symbol, data[0], save)
        const { spreadPutChain } = await parseSpreadPut(symbol, data[1], marketData, save)
        const { spreadCallChain } = await parseSpreadCall(symbol, data[1], marketData, save)


        const result = {
            success: true, 
            dt: date,
            marketData: marketData, 
            coveredChain: coveredChain,
            spreadPutChain: spreadPutChain, 
            spreadCallChain: spreadCallChain, 
        }

        return ( result )
        
    } catch( error ) {
        return ( {success: false, message: error.message} )
    }
}

module.exports = chain