const database = require('../database')
const Schema = database.Schema

const schema = new Schema({
    symbol: {type: String, required: true},
    expDate: {type: String, required: true},
    calcMargineInt: {type: Number},
    underPrice: {type: Number, required: true},

    callStrikeLow: {type: Number, required: true},
    callStrikeHight: {type: Number, required: true},
    putStrikeLow: {type: Number, required: true},
    putStrikeHight: {type: Number, required: true},

    call: {type: Number, required: true},
    put: {type: Number, required: true},
    callP: {type: Number, required: true},
    putP: {type: Number, required: true},

    strikeDiff: {type: Number, required: true},
    diff: {type: Number, required: true},
    diffP: {type: Number, required: true},

    putDiscount: {type: Number, required: true},
    callDiscount: {type: Number, required: true},

},
    { timestamps: true },
)


const Condor = database.model('Condor', schema)
module.exports = Condor
