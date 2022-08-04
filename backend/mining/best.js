const ToParce = require('../database/models/ToParce')
const chain = require('./chain')
const ServerLog = require('../database/models/ServerLog')

async function best() {
    try{
    
        const toParce = await ToParce
            .find({forDelete: false || undefined, maxDiscount: {$gt : 15}})
            .sort({maxDiscount: -1})
            .limit(100)
            .exec()


        const limit = 50
        const count = toParce.length

        const total =  Math.ceil(count / limit)
        let id = null
        const startLog = new ServerLog({event: 'Best options start...'})    
        startLog.save()

        for (let pack = 0; pack < count / limit; pack++) { 

                const serverLog = new ServerLog({event: 'Best options (' + count + '). Pack:' + (pack+1) + '/' + total})
                serverLog.save()
                id = serverLog.id

                for (let i = 0; i < limit; i++) { 
                    if (toParce.length > i + limit * pack) {
                        chain(toParce[i + limit * pack].symbol, true)
                    }
                }

                await new Promise(resolve => setTimeout(resolve, 100000 * (pack + 1)))

            // setTimeout( () => {
            //     if (id) {
            //         ServerLog.findByIdAndDelete(id).exec()
            //     }
            //     const serverLog = new ServerLog({event: 'Best options (' + count + '). Pack:' + (pack+1) + '/' + total})
            //     serverLog.save()
            //     id = serverLog.id
                
            //     for (let i = 0; i < limit; i++) { 
            //         if (toParce.length > i + limit * pack) {
            //             chain(toParce[i + limit * pack].symbol, true)
            //         }
            //     }
            // }, 100000 * pack )
        }

        return 

} catch(e) {
        return {message: e.message}
    }
        
}

module.exports = best