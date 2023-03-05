const mongoose = require('mongoose')

const asked_fileSchema = new mongoose.Schema({
    filename : { type : String, required : true },
    //Extract the Fy year of the file
    fy : { type : String, required : true },
    //Uploaded Date and Time
    month_quarter: { type : String},
    //GST, Income Tax, TDS
    purpose : { type : String, required : true },
    //Comments
    comments : { type : String},
    //Link to file uploaded
    email : { type : String, required : true },
    PAN: { type : String, required: true },
    files_uploaded : { type : [String]},
    //reference 
    user : {type : mongoose.Schema.Types.ObjectId, ref:'users',required: true}
});

module.exports = mongoose.model('asked_files', asked_fileSchema);