const database = require('../database')
const Schema = database.Schema

const schema = new Schema({
    symbol: {type: String, required: true},
    exDivDate: {type: Date, required: true},
    payDate: {type: Date},
    amount: {type: Number},
    yield: {type: Number},  
})

const Dividend = database.model('Dividend', schema)
module.exports = Dividend


