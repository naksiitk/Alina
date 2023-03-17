const mongoose = require('mongoose')

const returnSchema = new mongoose.Schema({
    uploadedname : { type : String, required : true },
    //Extract the Fy year of the file
    // fy_month_quarter : { type : String, required : true },
    //Uploaded Date and Time
    uploaded_date: { type : String, required : true },
    //GST, Income Tax, TDS
    purpose : { type : String, required : true },
    // //Comments
    // comments : { type : String, required : true },
    //Link to file uploaded
    files_uploaded : { type : String },
    //User detail and PAN
    email : { type : String, required : true },
    PAN: { type : String, required: true },
    // seen: { type: Boolean, required: true },
    //reference 
    user : {type : mongoose.Schema.Types.ObjectId, ref:'users',required: true}
},
{
    timestamps: true
});

module.exports = mongoose.model('returns', returnSchema);