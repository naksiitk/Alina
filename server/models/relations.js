const mongoose = require('mongoose')

const relationSchema = new mongoose.Schema({
    auditor_email : { type : String, required : true },
    clients_email : { type : [String] }, //use emails only
    staffs_email : { type: [String] }
});

module.exports = mongoose.model('relations', relationSchema);