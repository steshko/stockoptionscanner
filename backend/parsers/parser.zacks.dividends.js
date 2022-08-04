const axios = require('axios')
const Dividend = require('../database/models/Dividend')
const ServerLog = require('../database/models/ServerLog')

async function getData(date) {
    try {

        const url = 'https://www.zacks.com/includes/classes/z2_class_calendarfunctions_data.php?calltype=eventscal&date='+
                    + ((date / 1000).toFixed()) + '&type=5'
                                     
        let response = await axios({url, method: 'GET'})

        const arr=[]          
        response.data.data.forEach( (row, index) => {
            str = row[0]
            str = str.substr(str.indexOf('rel="') + 5)
            str = str.substr(0, str.indexOf('"'))
            amount = row[3]
            amount = amount.replace('$', '')
            arr.push({
                symbol: str,
                amount: parseFloat(amount) ? parseFloat(amount) : undefined,
                yield: parseFloat(row[4]) ? parseFloat(row[4]) : undefined,
                exDivDate: date,
                payDate: isNaN(Date.parse(row[7])) ? undefined : row[7]
            })
        })
        await Dividend.deleteMany( { symbol:arr.map(el => el.symbol) } ).exec()
        try {
            await Dividend.insertMany(arr)
        } catch (e) {
            console.log (e.message)
        }

    } catch (err) {
        return {message:err.message}
    }
}

async function parseZackseDividends() {
    try {
        
        const startDate = new Date()
        startDate.setDate(startDate.getDate());

        startDate.setDate(startDate.getDate() - 3)
        
        startDate.setHours(12);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0)
        Dividend.deleteMany( { exDivDate:{ $lt: startDate} }).exec()

        const date = startDate

        for (let i = 0; i < 35; i++) { 
            await getData(date)
            date.setDate(date.getDate() + 1)
        }

        const serverLog = new ServerLog({event: 'Zacks Divideds till ' + startDate.toLocaleDateString()})    
        await serverLog.save()
 
        return ({ success : true })


    } catch (err) {
        const serverLog = new ServerLog({event: 'Zacks Divideds error ' + err.message})    
        await serverLog.save()
        return {message:err.message}
    }
}

module.exports = parseZackseDividends
