require('dotenv');
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs')

const bucketName = process.env.AWS_S3
const region = process.env.AWS_region
const accessKeyId = process.env.AWS_access_key
const secretAccessKey = process.env.AWS_secret_access_key

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

module.exports.uploadfile = async(req) => {
    const filestream = fs.createReadStream(req.file.path);
    const uploadParams = {
        Bucket : bucketName,
        Body : filestream,
        Key : req.file.filename 
    }
    return s3.upload(uploadParams).promise()
};

module.exports.getfile = async(req) => {
    try{
    const downloadParams = {
        Key : req.fileKey,
        Bucket : bucketName,
    }
    return s3.getObject(downloadParams).createReadStream();
    }
    catch{
        return "cannot download file";
    }

};

module.exports.deletefile = async(req) => {
    const deleteParams = {
        Key : req.fileKey,
        Bucket : bucketName,
    }
    return s3.deleteObject(deleteParams).promise();
};

module.exports.copyfile = async(req) => {
    var params = {
        Bucket: bucketName, 
        CopySource: "/" + bucketName + "/" + req.sourcefileKey, 
        Key: req.destfileKey
    };
    return s3.copyObject(params).promise();
};

