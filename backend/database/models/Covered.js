const database = require('../database')
const Schema = database.Schema

const schema = new Schema({
    symbol: {type: String, required: true},
    expDate: {type: String, required: true},
    daysToExp: {type: Number},

    strikePrice: {type: Number, required: true},
    bid: {type: Number, required: true},
    ask: {type: Number, required: true},
    mid: {type: Number, required: true},
    netDebitBid: {type: Number, required: true},
    netDebitAsk: {type: Number, required: true},
    netDebitMid: {type: Number, required: true},
    underPrice: {type: Number, required: true},
    change: {type: Number, required: false},
    percentChange: {type: Number, required: false},

    interest: {type: Number},
    discount: {type: Number},

    strikeNum: {type: Number, required: true},
},
    { timestamps: true },
)

schema.index({ symbol: 1, expDate: 1, strikePrice: 1})

const Covered = database.model('Covered', schema)
module.exports = Covered
