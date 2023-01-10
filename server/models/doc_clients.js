const mongoose = require('mongoose')

const doc_client_schema = new mongoose.Schema({
    file_name : {
        type : String, 
        required : true
    },
    purpose : {
        type : String, 
        required : true
    },
    comments : {
        type : String, 
        required : true
    },
    files_uploaded : {
        type : String, 
        required : true
    }
});

module.exports = mongoose.model('Doc_client', doc_client_schema);