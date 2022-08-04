const database = require('../database')
const Schema = database.Schema

const UserSchema = new Schema(
  {
    userName: { type: String},
    email: { type: String},
    prevEmail: { type: String},
    prevEmailVerified: { type: Boolean},
  },
  { timestamps: true },
)

const EmailHistory = database.model('emailHistory', UserSchema)

module.exports = EmailHistory
