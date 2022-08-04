const database = require('../database')
const Schema = database.Schema

const schema = new Schema({
    symbol: {type: String, required: true},
    date: {type: Date, required: true},
    time: {type: String},
    estimate: {type: Number},
    reported: {type: Number},  
})

const Earning = database.model('Earning', schema)
module.exports = Earning
