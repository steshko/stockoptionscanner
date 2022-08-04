const axios = require('axios')
const Earning = require('../database/models/Earning')
const ServerLog = require('../database/models/ServerLog')

async function getData(date) {
    try {
        console.log(date)
        const url = 'https://www.zacks.com/includes/classes/z2_class_calendarfunctions_data.php?calltype=eventscal&date='
                    + ((date / 1000).toFixed()) + '&type=1'
        let response = await axios({url, method: 'GET'})
        const arr=[]          

        response.data.data.forEach( (row, index) => {
            str = row[0]
            str = str.substr(str.indexOf('rel="') + 5)
            str = str.substr(0, str.indexOf('"'))
            
            arr.push({
                symbol: str,
                date: date,
                time: row[3],
                estimate: parseFloat(row[4]) ? parseFloat(row[4]) : undefined,
                reported: parseFloat(row[5]) ? parseFloat(row[5]) : undefined
            })
        })
        await Earning.deleteMany( { symbol:arr.map(el => el.symbol) } ).exec()
        try {
            await Earning.insertMany(arr)
        } catch (e) {
            console.log (e.message)
        }

    } catch (err) {
        return {message:err.message}
    }
}

async function parseZackseErnings() {
    try {

        const startDate = new Date()
        startDate.setDate(startDate.getDate());

        startDate.setDate(startDate.getDate() - 3)
        
        startDate.setHours(12);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0)

        const date = startDate

        Earning.deleteMany( { date:{ $lt: startDate} }).exec()

        for (let i = 0; i < 35; i++) { 
            await getData(date)
            date.setDate(date.getDate() + 1)
        }

        const serverLog = new ServerLog({event: 'Zacks Earnings till ' + date.toLocaleDateString()})    
        await serverLog.save()
 
        return ({ success : true })

    } catch (err) {
        const serverLog = new ServerLog({event: 'Zacks Earning error ' + err.message})    
        await serverLog.save()
        return {message:err.message}
    }
}

module.exports = parseZackseErnings
