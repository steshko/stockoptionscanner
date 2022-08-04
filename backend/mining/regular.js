const ToParce = require('../database/models/ToParce')
const chain = require('./chain')
const ServerLog = require('../database/models/ServerLog')

async function regular() {
    try{

        const toParce = await ToParce
            .find({forDelete: false || undefined})
            .sort({maxDiscount: -1})
            .exec()

        const limit = 10
        const count = toParce.length
        const total =  Math.ceil(count / limit)
        let id = null
        const startLog = new ServerLog({event: 'Regular options start...'})    
        startLog.save()

        for (let pack = 0; pack < count / limit; pack++) { 
            setTimeout( () => {
                if (id) {
                    ServerLog.findByIdAndDelete(id).exec()
                }
                const serverLog = new ServerLog({event: 'Regular options (' + count + '). Pack:' + (pack+1) + '/' + total})    
                serverLog.save()
                id = serverLog.id
                for (let i = 0; i < limit; i++) { 
                    if (toParce.length > i + limit * pack) {
                        chain(toParce[i + limit * pack].symbol, true)
                    }
                }
            }, 11000 * pack )
        }

        return
        
    } catch(e) {
        return {message: e.message}
    }
        
}

module.exports = regular