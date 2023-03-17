const mongoose = require('mongoose')

const client_doc_summary_Schema = new mongoose.Schema({
    //Extract the name of the file
    unseen: { type: Number, required: true },
    total : { type: Number, required: true },
    email : { type : String, required : true },
    purpose : { type : String, required : true },
    //reference 
    user : {type : mongoose.Schema.Types.ObjectId, ref:'users',required: true}},
    {
        timestamps: true
    });


module.exports = mongoose.model('client_doc_summary', client_doc_summary_Schema);