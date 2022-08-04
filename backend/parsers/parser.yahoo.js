const axios = require('axios')
const Stock = require('../database/models/Stock')

async function parseProfile(symbol) {
    try {

        if (!symbol) return 

        symbol = symbol.toUpperCase()
        
        const url1 = 'https://query1.finance.yahoo.com/v10/finance/quoteSummary/' + symbol + '?modules=assetProfile'
                                     
        let response1 = await axios({url: url1, method: 'GET'})
        const {industry, sector, fullTimeEmployees} = response1.data.quoteSummary.result[0].assetProfile

        const url2 = 'https://query1.finance.yahoo.com/v10/finance/quoteSummary/' + symbol + '?modules=price'
                                     
        let response2 = await axios({url: url2, method: 'GET'})
        const {shortName, quoteType, exchangeName} = response2.data.quoteSummary.result[0].price

        let stock = await Stock.findOne({symbol: symbol})
        if (!stock) stock = new Stock({symbol: symbol})
        if (stock) {
            stock.name = shortName
            stock.industry = industry
            stock.sector = sector
            stock.employees = fullTimeEmployees
            stock.quoteType = quoteType
            stock.exchangeName = exchangeName

//            await stock.save()
            stock.save()
        }
        return stock

    } catch (err) {
        return {message: err.message}
    }
}

async function parseYahooSummary() {
    try {
        
        const symbolList = await Stock.find({ "name": undefined })

        symbolList.forEach(async (el) =>  {
            const result = parseProfile(el.symbol)
            if (result.message) {
                await Stock.findOneAndDelete({symbol: symbol})
            }

        })

        return ({success: true})

    } catch (err) {
        console.log('parseYahooSummary', err.message)
        return {message:err.message}
    }
}

module.exports = {parseYahooSummary, parseProfile}
