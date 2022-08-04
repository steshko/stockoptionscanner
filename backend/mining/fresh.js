const ToParce = require('../database/models/ToParce')
const chain = require('./chain')
const ServerLog = require('../database/models/ServerLog')

async function fresh() {
    try{

        const toParce = await ToParce
            .find({lastCalc: undefined, forDelete: false || undefined})
            .exec()

        const limit = 50
        const count = toParce.length
        if (count === 0) return

        const total =  Math.ceil(count / limit)
        let id = null
        const startLog = new ServerLog({event: 'New options start...'})    
        await startLog.save()

        for (let pack = 0; pack < count / limit; pack++) { 

            const serverLog = new ServerLog({event: 'New options (' + count + '). Pack:' + (pack+1) + '/' + total})
            serverLog.save()
            id = serverLog.id
    
            for (let i = 0; i < limit; i++) { 
                if (toParce.length > i + limit * pack) {
                    chain(toParce[i + limit * pack].symbol, true)
                }
            }
            await new Promise(resolve => setTimeout(resolve, 100000 * (pack + 1)))
        }

        return
        
    } catch(e) {
        return {message: e.message}
    }
        
}

module.exports = fresh