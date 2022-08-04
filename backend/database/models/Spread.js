const database = require('../database')
const Schema = database.Schema

const schema = new Schema({
    symbol: {type: String, required: true},
    expDate: {type: String, required: true},
    daysToExp: {type: Number},
    // calcMargineInt: {type: Number},
    type: {type: String, required: true}, // call or put
    underPrice: {type: Number, required: true},
    change: {type: Number, required: false},
    percentChange: {type: Number, required: false},

    strikeLow: {type: Number, required: true},
    strikeHight: {type: Number, required: true},
    strikeNum: {type: Number, required: true},

    lowBid: {type: Number, required: true},
    lowAsk: {type: Number, required: true},
    hightBid: {type: Number, required: true},
    hightAsk: {type: Number, required: true},
    
    discount: {type: Number},
    interest: {type: Number},

    
    res: {type: Number},
    resP: {type: Number},
    resPrc: {type: Number},
    resPrcP: {type: Number},

},
    { timestamps: true },
)

const Spread = database.model('Spread', schema)
module.exports = Spread
