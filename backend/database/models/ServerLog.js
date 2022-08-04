const database = require('../database')
const Schema = database.Schema

const schema = new Schema({
    event: {type: String, required: true},
    date: {type: Date, required: true, default: Date.now},
})

const ServerLog = database.model('ServerLog', schema)
module.exports = ServerLog