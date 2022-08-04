const axios = require('axios')

module.exports = function isMarketOpen() {
    try{
        var d = new Date()
        date = d.toLocaleString('en-US', {timeZone: 'America/New_York', hour12: false, hour: "2-digit", minute: "2-digit", weekday: "short" })

        const dw = date.slice(0, 3)
        const h = parseInt(date.slice(4, 6)) + parseInt(date.slice(7, 9))/100
//        console.log(date, dw, h)
        return !(['Sat', 'Sun'].includes(dw) || h <= 9.55 || h > 16)

    } catch( error ) {
        return false
    }
}


