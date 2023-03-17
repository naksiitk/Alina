const mongoose = require('mongoose')

const credentialSchema = new mongoose.Schema({
    //Who's credentials
    email : { type : String, required : true },

    //GST, Income Tax or TDS
    credential_type : { type : String, required : true },

    //Credentials
    user_id : { type : String, required : true },
    password : { type : String, required : true },

    registered_mobile: { type : Number},
    registered_email: { type: String}},
    {
        timestamps: true
    });

module.exports = mongoose.model('credentials', credentialSchema);