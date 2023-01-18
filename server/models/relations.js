const mongoose = require('mongoose')

const relationSchema = new mongoose.Schema({
    auditor__id : { type : String, required : true },
    clients__id: { type : [String] }, //use emails only
    staffs__id: { type: [String] }
});

module.exports = mongoose.model('relations', relationSchema);