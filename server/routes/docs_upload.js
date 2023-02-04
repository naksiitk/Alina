const express = require('express')
const router = express.Router()
const asked_files = require('../models/asked_files')
const users = require('../models/users')
const fs = require('fs');
const util = require('util');
const unlinkfile = util.promisify(fs.unlink);

const multer = require("multer")
const { uploadfile, getfile, deletefile } = require('../services/s3')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, `${file.originalname}_${Date.now()}`);
    }
  })

  const upload = multer({ storage });


router.get("/", (req,res) =>{
    res.send("It is working")
})


router.post("/file", upload.single("file"), async(req,res) =>{
  try {
    const file = req.file;
    if(file)
    {
      const result = await uploadfile({file: file});
      console.log(result);
      res.json(result);
      await unlinkfile(file.path);
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

router.get("/images/:key", async(req,res) =>{
  try {
    console.log(req.params.key)
    const fileKey = req.params.key;
    const result = await getfile({fileKey:fileKey});
    result.pipe(res);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

router.delete("/images/:key", async(req,res) =>{
  try {
    console.log(req.params.key)
    const fileKey = req.params.key;
    const result = await deletefile({fileKey:fileKey});
    console.log(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

module.exports = router
//Getting All