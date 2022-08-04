const express = require('express')
const path = require('path')
const compression = require('compression')
const bodyParser = require('body-parser')

const {
    init: databaseInit,
    middleware: databaseMiddleware,
} = require('../database/databaseInit')

const app = express()
app.disable('x-powered-by')
app.use(express.static(path.join(__dirname, '../../frontend/build')))
app.use(compression())

//???
app.use(express.json({ extended: true }))
// app.use(bodyParser.json({extended: true}))
// app.use(bodyParser.urlencoded({extended: true}))
//end of ???

databaseInit().catch((error) => console.error(error))
app.use(databaseMiddleware)

app.use('/api/auth', require('./auth.routes'))
app.use('/api/covered', require('./covered.routes'))
app.use('/api/spread', require('./spread.routes'))
app.use('/api', require('./api.routes'))
app.use('/api/chain', require('./chain.routes'))
app.use('/api/top', require('./top.routes'))
app.use('/api/best', require('./best.routes'))
app.use('/api/chart', require('./chart.routes'))
app.use('/mining/', require('./mining.routes'))


app.get('*', function(req, res) {
   res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'))
})

module.exports = app
