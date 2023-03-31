const mongoose = require('mongoose')
const users = require('./users')

const AISSchema = new mongoose.Schema({

    Amount: { type : String },
    Amount_description: { type : String},
    Count: { type : String },
    Information_category: { type : String },
    Information_code: { type : String },
    Information_description:{ type : String },
    Information_source: { type : String },
    PAN: { type : String },
    amount_books: { type : String },
    email: { type : String },
    lock: { type : Boolean },
    reason: { type : String }
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model('AIS', AISSchema);