const axios = require('axios')
const parseProfile = require('../../parsers/parser.yahoo').parseProfile
const parseYahooSummary = require('../../parsers/parser.yahoo').parseYahooSummary
const Stock = require('../../database/models/Stock')


const addResult = (result, response, market) => {
    response.data.forEach(el => {
        const index = result.findIndex( (res) => res.symbol === el.symbol)
        if (index < 0) {
            result.push({...el, market:market, marketList:[market]})
        } else {
            result[index].marketList.push(market)
        }
    })
}

module.exports = async function topByIndex()  {
    try{

        const apikey = process.env.ATAPIKEY
        const result = []
        const market1='$SPX.X'
        const url1 = 'https://api.tdameritrade.com/v1/marketdata/' + market1 + '/movers' + '?apikey='+apikey

        const response1 = axios({url: url1, method: 'GET'})

        const market2='$COMPX'
        const url2 = 'https://api.tdameritrade.com/v1/marketdata/' + market2 + '/movers' + '?apikey='+apikey


        const response2 = axios({url: url2, method: 'GET'})

        const market3='$DJI'
        const url3 = 'https://api.tdameritrade.com/v1/marketdata/' + market3 + '/movers' + '?apikey='+apikey

        let response3 = axios({url: url3, method: 'GET'})

        const data = await Promise.all([response1, response2, response3])

        if (data[0]) {
            addResult(result, data[0], market1)
        }
        if (data[1]) {
            addResult(result, data[1], market2)
        }
        if (data[3]) {
            addResult(result, data[2], market3)
        }

        const url = 'https://api.tdameritrade.com/v1/marketdata/quotes?apikey=' + apikey + 
        '&symbol=' + result.map( el => el.symbol).toString()


        let response = await axios({url: url, method: 'GET'})
        let top = []


         result.forEach( el => {
            top.push({ ...el, ...response.data[el.symbol]})
        })

        const stockList = await Stock.find( { symbol: {$in: result.map( el => el.symbol)} } )
        top.forEach( el => {
            const index = stockList.findIndex( stock => stock.symbol === el.symbol )
            if (index >=0) {
                el.name = stockList[index].name
                el.industry = stockList[index].industry
                el.sector = stockList[index].sector
                el.mktCap = stockList[index].mktCap
            } else {
                stock = new Stock({symbol: el.symbol})
                stock.save()
            }
        })

        await parseYahooSummary()
        
        return ({ 
            report: "byIndex", 
            list: top.map( top => ({
                symbol: top.symbol,
                assetType: top.assetType,
                sector: top.sector,
                exchangeName: top.exchangeName,
                name: top.name,
                market: top.market,
                marketList: top.marketList,
                last: top.last,
                changePercent: top.change * 100,
                change: top.last - top.closePrice,
                closePrice: top.closePrice,
                volume: top.totalVolume,
                mktCap: top.mktCap,
                PE: top.peRatio,
                High52: top['52WkHigh'],
                Low52: top['52WkLow'],
            }))
        })
            

    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message)
        }
      
        console.error(error);
        return res.status(500).send(error.message)
    }
}
