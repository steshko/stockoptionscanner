const {Router} = require('express')
const router = Router()

const regular = require('../mining/regular')
const best = require('../mining/best')
const fresh = require('../mining/fresh')

const parseZackseErnings = require('../parsers/parser.zacks.earnings');
const parseZackseDividends = require('../parsers/parser.zacks.dividends');
const parseTradingView = require('../parsers/parser.tradingview')

const ToParce = require('../database/models/ToParce')
const TopList = require('../database/models/TopList')
const Covered = require('../database/models/Covered')
const Spread = require('../database/models/Spread')
const Condor = require('../database/models/Condor')
const ServerLog = require('../database/models/ServerLog')
const Setting = require('../database/models/Setting')

async function saveTop () {
    try{
        await TopList.deleteMany({isManual: true})

        const startDate = new Date()
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);

        // await TopList.deleteMany({isManual: false, date: {$gte: startDate}})

        await parseTradingView('gainers', false)



        await parseTradingView('losers', false)
        await parseTradingView('active', false)
        await parseTradingView('large-cap', false)
        await parseTradingView('most-volatile', false)
        await parseTradingView('overbought', false)
        await parseTradingView('oversold', false)

        const serverLog = new ServerLog({event: 'Top lists saved'})
        await serverLog.save()

        return 

    } catch(e) {
        const serverLog = new ServerLog({event: 'Top save error ' + e.message})
        await serverLog.save()
    }
}

router.get('/beforeopen', async function (req, res) {
    try{

        await parseZackseErnings()
        await parseZackseDividends()

        await Covered.deleteMany({})
        await Spread.deleteMany({})
        await Condor.deleteMany({})

        return res.send( { success : true} )
        
    } catch(e) {
        res.status(500).json({message:e.message})
    }
})

router.get('/afteropen', async function (req, res) {
    try{
        await saveTop()

        res.send( { success : true} )

        await Setting.updateOne({}, {lazyOn: true} ).exec()
        await saveTop()
        await fresh()
//        await best()
        regular()

        return// res.send( { success : true} )
        
    } catch(e) {
        res.status(500).json({message:e.message})
    }
})
router.get('/marketopen', async function (req, res) {
    try{
        res.send( { success : true} )

        await saveTop()
        await fresh()
        best()
        Setting.updateOne({}, {lastBest: new Date} ).exec()
        return res.send( { success : true} )
        // }

        return //res.send( { success : true} )
        
    } catch(e) {
        res.status(500).json({message:e.message})
    }
})
router.get('/beforeclose', async function (req, res) {
    try{
        await saveTop()
        regular()
        Setting.updateOne({}, {lazyOn: false, activeOn:false} ).exec()

        return res.send( { success : true} )
        
    } catch(e) {
        res.status(500).json({message:e.message})
    }
})
router.get('/afterclose', async function (req, res) {
    try{
        
        const dateOld = new Date()
        dateOld.setDate(dateOld.getDate() - 10)

        const dateOneMonth = new Date()
        dateOneMonth.setDate(dateOneMonth.getDate() - 30)
        const dateToday = new Date()
        dateToday.setHours(0);

        await parseZackseErnings()
        await parseZackseDividends()

        await ToParce.deleteMany({forDelete: true})

        await ToParce.deleteMany({lastFound: {$lt: dateOld}})

        await ToParce.deleteMany({lastFound: undefined})

        await TopList.deleteMany({date: {$lt: dateOneMonth}})

        await ServerLog.deleteMany({date: {$lt: dateToday}})

        return res.send( { success : true} )
        
    } catch(e) {
        res.status(500).json({message:e.message})
    }
})

router.get('/regular', async function (req, res) {
    try{

        regular()
        Setting.updateOne({}, {lastRegular: new Date} ).exec()
        return res.send( { success : true} )

    } catch(e) {
        res.status(500).json({message:e.message})
    }
})

router.get('/fresh', async function (req, res) {
    try{

        fresh()
        // Setting.updateOne({}, {lastRegular: new Date} ).exec()
        return res.send( { success : true} )

    } catch(e) {
        res.status(500).json({message:e.message})
    }
})


router.get('/best', async function (req, res) {
    try{

        best()
        Setting.updateOne({}, {lastBest: new Date} ).exec()
        return res.send( { success : true} )

    } catch(e) {
        res.status(500).json({message:e.message})
    }
})


module.exports = router