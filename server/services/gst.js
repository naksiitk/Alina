require('dotenv').config()

const fetch = require('node-fetch');

module.exports.checkGSTstatus = async(req) => {
    fetch('https://gstapi.charteredinfo.com/commonapi/v1.1/search?aspid=1720553323&password=Reithick@1&Action=TP&Gstin=33AKMPK5944M1ZN&SearchGstin=' + req.PANorGSTIN)
    // .then(res => res.json())
    .then(res => console.log(res));
};