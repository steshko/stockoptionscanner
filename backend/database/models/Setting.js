const database = require('../database')
const Schema = database.Schema

const schema = new Schema({
    lazyOn: {type: Boolean, required: true, default: false},  
    activeOn: {type: Boolean, required: true, default: false},
    lastRegular: {type: Date},
    lastBest: {type: Date}
})

const Setting = database.model('Setting', schema)
module.exports = Setting
