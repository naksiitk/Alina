const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    email : { type : String, required : true },
    OTP : { type : [String] }, //use emails only
    createdAt: { type: Date, expires: 600, default: Date.now }
});

module.exports = mongoose.model('otp', otpSchema);