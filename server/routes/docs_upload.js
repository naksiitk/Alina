const express = require('express')
const router = express.Router()
const asked_files = require('../models/asked_files')
const users = require('../models/users')
const fs = require('fs');
const util = require('util');
const unlinkfile = util.promisify(fs.unlink);
const docs = require('../models/docs')

const multer = require("multer")
const { uploadfile, getfile, getzippedfiles, deletefile, copyfile } = require('../services/s3')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, `${Date.now()}_${file.originalname}`);
    }
  })

  const upload = multer({ storage });


router.get("/", (req,res) =>{
    res.send("It is working")
})


router.post("/file", upload.array("files"), async(req,res) =>{
  try {
    results = []
    console.log(req)
    const files = req.files;
    console.log(req.files)
    if(Array.isArray(files) && files.length > 0 )
    {
      for (const file of files) 
        {
          let file_name = file.filename;
          file.filename = req.body.files_from +"/" 
              +req.body.files_name +"/" + file.filename;
          const result = await uploadfile({file: file});
          console.log(result);
          result.key = file_name;
          results.push(result.key);
          await unlinkfile(file.path);
        }

      res.status(200).json({keys : results});
    }
  } catch (error) {
    res.status(500).json({Status: error.message})
  }
})

router.get("/images/:id/key/:key",[OpenJWT, getDoc, Access ], async(req,res) =>{
  try {
    const user = await users.findOne({email: res.doc.email})
    let name = user.user_name + "_" + user.PAN[0];
    name = name.split("/")[0];
    let fileKey = res.doc.fy +"/" + res.doc.purpose +"/" 
        + name +"/" + res.doc.filename+"/"+req.params.key;
    const result = await getfile({fileKey:fileKey});
    result.pipe(res);
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
})

router.get("/download/zip/:id",[OpenJWT, getDoc, Access ], async(req,res) =>{
  try {
  const user = await users.findOne({email: res.doc.email})
  let name = user.user_name + "_" + user.PAN[0];
    name = name.split("/")[0];
    let folder = res.doc.fy +"/" + res.doc.purpose +"/" 
        + name +"/" + res.doc.filename;
    const result = await getzippedfiles({folder: folder, files_array : res.doc.files_uploaded});
    result.pipe(res);
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
})

router.get("/mobile/images/:id/key/:key",[getDoc], async(req,res) =>{
  try {
    const user = await users.findOne({email: res.doc.email})
    let name = user.user_name + "_" + user.PAN[0];
    name = name.split("/")[0];
    let fileKey = res.doc.fy +"/" + res.doc.purpose +"/" 
        + name +"/" + res.doc.filename+"/"+req.params.key;
    const result = await getfile({fileKey:fileKey});
    result.pipe(res);
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
})

router.delete("/images/fy/:fy/email/:email/key/:key", [OpenJWT, Access], async(req,res) =>{
  try {
    console.log(req.params.key)
    const fileKey = req.params.fy+"/"+req.params.email+"/"+req.params.key;
    const result = await deletefile({fileKey:fileKey});
    // console.log(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

router.put("/file_copy", async(req,res) =>{
  try {
    let results = []
    console.log(req.body.files_uploaded)
    for (let file of req.body.files_uploaded) 
        { 
          //console.log(file)
          let fileKey = file;
          sourcefileKey = req.body.source_files_from +"/" 
                +req.body.source_files_name +"/" + fileKey;
          destfileKey = req.body.dest_files_from +"/" 
                +req.body.dest_files_name +"/" + fileKey;
          const result = await copyfile({ sourcefileKey: sourcefileKey, destfileKey : destfileKey});
          results.push(result);
          if(sourcefileKey  != destfileKey){
          const result1 = await deletefile({fileKey:sourcefileKey});
          results.push(result1);}
      }
    return res.json(results);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

async function getDoc(req,res, next)
{
    let doc
    try {
        doc = await docs.findById(req.params.id)
        if(doc == null){
          doc = await asked_files.findById(req.params.id)
          if(doc == null)
            return res.status(404).json({message : 'Cannot Find Doc'})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    res.doc = doc
    next()
}

const JWT = require('jsonwebtoken')

function OpenJWT(req, res, next) {
    const authHeader = req.headers.authorization
    const Token = authHeader && authHeader.split(' ')[1]

    if(Token == null) return res.status(401).json({'msg' : 'Access Denied, Please Login'})

    JWT.verify(Token, process.env.JWT_SECRET_KEY , (err, user) => {
        if(err) return res.status(403).json({'msg' : 'Access Denied, Invalid JWT'})
        req.JWT = user
        next()
    })
}

async function Access(req, res, next) {
  if(req.JWT.email == res.doc.email) {
    console.log(req.JWT.email,"hi")
    return next()
  }
  else {
    const user = await users.findOne({email: req.JWT.email})
    if(user.user_type == 'auditor') {
      return next()
    }
    else return res.status(403).json({'message' : 'Hello Access Denied, Invalid JWT'})
  }
}
module.exports = router
//Getting All