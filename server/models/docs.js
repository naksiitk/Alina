const mongoose = require('mongoose')

const docSchema = new mongoose.Schema({
    //Extract the name of the file
    file_name : { type : String, required : true },

    //GST, Income Tax, TDS
    purpose : { type : String, required : true },
    comments : { type : String, required : true },

    //Link to file uploaded
    files_uploaded : { type : String, required : true },

    //User detail and PAN
    email : { type : String, required : true },
    PAN: { type : String, required: true },

    seen: { type: Boolean, required: true },

    //reference 
    user : {type : mongoose.Schema.Types.ObjectId, ref:'users',required: true}
});

module.exports = mongoose.model('docs', docSchema);