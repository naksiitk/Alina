const mongoose = require('mongoose')

const docSchema = new mongoose.Schema({
    filename : { type : String, required : true },
    //Extract the Fy year of the file
    month_quarter : { type : String },
    //Extract the Fy year of the file
    fy : { type : String, required : true },
    //Uploaded Date and Time
    uploadedat: { type : String, required : true },
    //GST, Income Tax, TDS
    purpose : { type : String, required : true },
    //Comments
    comments : { type : String, required : true },
    //Link to file uploaded
    files_uploaded : { type : [String], required : true },
    //User detail and PAN
    email : { type : String, required : true },
    PAN: { type : String, required: true },
    seen: { type: Boolean, required: true },
    lock: { type: Boolean, required: true },
    //reference 
    user : {type : mongoose.Schema.Types.ObjectId, ref:'users',required: true}
});

module.exports = mongoose.model('docs', docSchema);