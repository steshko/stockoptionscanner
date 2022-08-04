const database = require('../database')
const Schema = database.Schema

const UserSchema = new Schema(
  {
    phoneNumber: { type: String, maxlength: 24 },
    email: { type: String, maxlength: 255, index: {unique: true} },
    // userName: { type: String, maxlength: 255 },
    password: { type: String, maxlength: 255 },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, maxlength: 255 },
    emailVerificationTokenExpiresAt: { type: Date },
    passwordResetToken: { type: String, maxlength: 255 },
    passwordResetTokenExpiresAt: { type: Date },
    disabled: { type: Boolean, default: false },
    roles: [{ type: String }],
    industryColor: [{
        industry: { type: String },
        color: { type: String },
    }],
    calcYield: {type: Number},
    minStockPrice: {type: Number},
    maxStockPrice: {type: Number},
    marginInterest: {type: Number},
  },
  { timestamps: true },
)


const User = database.model('user', UserSchema)

module.exports = User
