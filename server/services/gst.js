require('dotenv').config()

const fetch = require('node-fetch');


module.exports.checkGSTstatus = async(req, res) => {
    let status

    return fetch('https://gstapi.charteredinfo.com/commonapi/v1.1/search?aspid=1720553323&password=Reithick@1&Action=TP&Gstin=33AKMPK5944M1ZN&SearchGstin=' + req.PANorGSTIN)
    .then((gres) => { 
        status = gres.status; 
        return gres.json() 
      }).then(gres => {
        gres.status = status;
        return gres
      })
      .catch((err) => {
        // handle error
        console.error(err);
      });

};