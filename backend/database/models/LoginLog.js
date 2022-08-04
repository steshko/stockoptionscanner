const database = require('../database')
const Schema = database.Schema

const UserSchema = new Schema(
  {
    userName: { type: String },
    ip: { type: String }
  },
  { timestamps: true },
)

const LoginLog = database.model('loginLog', UserSchema)

module.exports = LoginLog
