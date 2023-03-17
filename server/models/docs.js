const mongoose = require('mongoose')

const docSchema = new mongoose.Schema({
    filename : { type : String, required : true },
    //Extract the Fy year of the file
    month_quarter : { type : String },
    //Extract the Fy year of the file
    fy : { type : String, required : true },
    //Uploaded Date and Time
    uploadedat: {type : String},
    //GST, Income Tax, TDS
    purpose : { type : String, required : true },
    //Comments
    comments :  { type : String },
    //Link to file uploaded
    files_uploaded : { type : [String]},
    //User detail and PAN
    email :     { type : String, required : true },
    PAN:        { type : String, required: true },
    seen:       { type: Boolean, required: true },
    lock:       { type: Boolean, required: true },
    asked:      { type: Boolean, required: true },
    //reference 
    user : {type : mongoose.Schema.Types.ObjectId, ref:'users',required: true}
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('docs', docSchema);