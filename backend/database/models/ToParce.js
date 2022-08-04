const database = require('../database')
const Schema = database.Schema

const schema = new Schema({
    symbol: {type: String, required: true, unique: true},
    forDelete: {type: Boolean, required: true, default: false},
    maxDiscountCovered: {type: Number},
    maxDiscountSpread: {type: Number},
    lastFound: {type: Date},
    lastCalc: {type: Date},
}
)

const ToParce = database.model('ToParce', schema)
module.exports = ToParce

