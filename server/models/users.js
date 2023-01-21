const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    //for Authenticating into the website, email is the primary key
    email: { type:String, required: true, unique : true },
    password: { type:String, required: true },

    //Contact and name
    mobile: {type: [Number]},
    user_name: { type: String},

    //For internal use
    user_type: { type:String , required: true},
    PAN: { type:[String] },
    company_name: { type: [String]}
})

module.exports = mongoose.model('users',userSchema)
