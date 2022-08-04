const database = require('../database')
const Schema = database.Schema

const schema = new Schema({
    symbol: {type: String, required: true, unique: true},
    name: {type: String},        //price
    industry: {type: String},    //assetProfile
    sector: {type: String},      //assetProfile
    quoteType: {type: String},      //price
    exchangeName: {type: String},   //price
    employees: {type: Number},   //assetProfile
})

schema.index({ symbol: 1})

const Stock = database.model('Stock', schema)
module.exports = Stock

