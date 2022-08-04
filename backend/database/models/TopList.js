const database = require('../database')
const Schema = database.Schema

const schema = new Schema({
    report:{type: String, required: true},
    date:{type: Date, default: Date.now},
    isManual:{type: Boolean, default: true},
    list: [{
        checked :{type: Boolean, default: false},
        code: {type: String},   //s
        name: {type: String},   //d[12]
        type: {type: String},   //d[14]
        sector: {type: String}, //d[11]

        symbol: {type: String, required: true}, //d[1]
        last: {type: Number},                   //d[2]
        changePercent: {type: Number},          //d[3]
        change: {type: Number},                 //d[4]
        vol: {type: Number},                    //d[6]
        mktCap: {type: Number},                 //d[7]
        employees: {type: Number},              //d[10]
        PE:{type: Number},                      //d[8]
        EPS:{type: Number},                     //d[9]
    }]
})

const TopList = database.model('TopList', schema)
module.exports = TopList
