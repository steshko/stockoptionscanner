const cheerio = require('cheerio');
const axios = require('axios')
const TopList = require('../database/models/TopList');
const ToParce = require('../database/models/ToParce');


async function parseTradingView(rep_type, isManual) {
    try {
// console.log('start')
        const MINPRICE = process.env.MINPRICE || 1
        const MINDOWN = process.env.MINDOWN || -6
        const MINUP = process.env.MINUP || 10
        
        const url = 'https://www.tradingview.com/markets/stocks-usa/market-movers-' + rep_type

        let response = await axios({url, method: 'GET'})
        let data
        const $ = cheerio.load(response.data)
        $('body script')
        // $('head script')
        .each( (i, element) => {  
            // if (i === 10) { 
                // console.log('element', i, element)
            // } 
            if (i === 4) { 
                data =element
            } 
        })
        // return toSave
        // console.log('stop', data.children[0])
        // return toSave
        let str = String(data.children[0].data)
        // console.log('stop1', str)
        // str = str.substr(str.indexOf('window.initData.screener_data') + 33)
        // str = '"' + str.substr(0, str.indexOf('";')) + '"'
        // console.log('stop2', str)
        // const json = eval(str);
        // str = '"' + str + '"'
        const json = str;
        // console.log(json);
        const obj = JSON.parse(json);
        // console.log('stop1', dataObj.nD3nAX['response_json'])
        const dataObj = obj[Object.keys(obj)[0]].response_json

        // console.log('stop1', dataObj)
        const toSave = new TopList({
            report: rep_type,
            isManual: isManual,
            list :[]
        })

        dataObj.data.forEach( (row, index) => {
//rep-type   gainers losers         
//+NASDAQ
//+NYSE
//volume>500 000
//Net% > 5%
//Last > 1
//9:55
//10:30
//12:00
//15:00
//15:45
            if (row.d[1]) {

                // if (row.d[16] > 100000) {
                    toSave.list.push({
                        code:   row.s.substr(0, row.s.indexOf(':')),
                        name:   row.d[1],
                        type:   row.d[4],
                        sector: row.d[22],
                
                        symbol: row.d[0],
                        last:   row.d[6],
                        changePercent: row.d[12],
                        change: row.d[13],
                        vol:    row.d[16],
                        mktCap: row.d[17],

                        employees:  row.d[21],
                        PE:         row.d[19],
                        EPS:        row.d[20]
                        // code:   row.s.substr(0, row.s.indexOf(':')),
                        // name:   row.d[12],
                        // type:   row.d[14],
                        // sector: row.d[11],
                
                        // symbol: row.d[1],
                        // last:   row.d[2],
                        // changePercent: row.d[3],
                        // change: row.d[4],
                        // vol:    row.d[6],
                        // mktCap: row.d[7],

                        // employees:  row.d[10],
                        // PE:         row.d[8],
                        // EPS:        row.d[9]
                    })
                // }
            }
        })

        if (rep_type === 'gainers' || rep_type === 'losers')  {
            const toParceAdd = toSave.list
                .filter( 
                    el => el.code !== 'AMEX' && 
                    el.last > MINPRICE && 
                   (el.changePercent < MINDOWN || el.changePercent > MINUP) &&
                    el.vol > 500000
                )
                .map( el => ({symbol: el.symbol, ITM: 0, OTM: 0}))
                
            toParceAdd.forEach( el => {
                ToParce.updateOne({symbol: el.symbol}, {symbol: el.symbol}, {upsert: true}, (err, r)=>{})
//                ToParce.exists({symbol: el.symbol});
            })
        }

        await toSave.save()    
        console.log(toSave)
        return toSave

    } catch (err) {
        console.log(err, err.message)
        return {message:err.message}
    }
}

module.exports = parseTradingView

