const express = require('express')
const router = express.Router()
const docs = require('../models/docs')
const users = require('../models/users')
const client_doc_summary = require('../models/client_doc_summary')
const asked_files = require('../models/asked_files')
const fs = require('fs');
const util = require('util');
const unlinkfile = util.promisify(fs.unlink);
const multer = require("multer")
const { uploadfile, getfile, deletefile, copyfile } = require('../services/s3')


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

//Getting All
router.get('/' , async (req,res)=>{
    try {
        const doc_list = await docs.find().sort({$natural:-1})
        res.json(doc_list)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
//Getting One All For clients side
router.get('/:id' , async (req,res)=>{
    try {
        const doc_list = await docs.find({email : req.params.id, asked:false}).sort({$natural:-1})
        res.json(doc_list)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
//Getting Client Distinct
router.get('/client_list/:id' , async (req,res)=>{
    try {
        const clients_list = await client_doc_summary.find({purpose : req.params.id}).populate('user','user_name PAN').sort({unseen:-1})
        res.json(clients_list)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


//Getting docs based on purpose and files uploaded is []
router.post('/purpose' , async (req,res)=>{
    try {
        const doc_list = await docs.find({email : req.body.email, purpose : req.body.purpose, 'files_uploaded': {$ne : []}}).sort({seen:1, updatedAt:-1})
        res.json(doc_list)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Creating One
router.post('/' , async(req,res)=>{
    let userPAN
    let userid
    try {
        const user = await users.findOne({email: req.body.email})
        userPAN = user.PAN[0]
        userid = user.id
    } catch (error) {
        res.status(500).json({message: error.message})
    }
    const clients_list = new docs({
        filename : req.body.filename,
        fy: req.body.fy,
        month_quarter: req.body.month_quarter,
        uploadedat: req.body.uploadedat,
        purpose: req.body.purpose,
        comments: req.body.comments,
        files_uploaded: req.body.files_uploaded,
        email : req.body.email,
        PAN : userPAN,
        seen : false,
        user : userid,
        lock : true,
        asked : false
    })

    await client_doc_summary.updateOne(
        {email : req.body.email, purpose:req.body.purpose},
        {$inc : {unseen: 1, total : 1}, user: userid},
        {upsert:true}
    )
    try {
        const newDoc_client = await clients_list.save()

        res.status(201).json(newDoc_client);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

//New Posting with files
router.post('/post' , upload.array("files"),async(req,res)=>{
    let userPAN
    let userid
    try {
        const user = await users.findOne({email: req.body.email})
        userPAN = user.PAN[0]
        userid = user.id

        results = []
        const files = req.files;
        let name = user.user_name + "_" + user.PAN[0];
        name = name.split("/")[0];
        let files_uploads = []
        //name.split('/')
        if(Array.isArray(files) && files.length > 0 )
        {
          for (const file of files) 
            {
              let file_name = file.filename;
              files_uploads.push(file_name);
              file.filename = req.body.fy +"/" + req.body.purpose +"/" 
              + name +"/" + req.body.filename +"/" + file.filename;
              await uploadfile({file: file}).then(
                (result) => {
                    console.log({result}); // Log the result of 50 Pokemons
                },
                (error) => {
                    // As the URL is a valid one, this will not be called.
                    return res.status(400).json({Status: error.message}) // Log an error
                });

              await unlinkfile(file.path).then(
                (result) => {
                    console.log({result}); // Log the result of 50 Pokemons
                },
                (error) => {
                    // As the URL is a valid one, this will not be called.
                    return res.status(400).json({Status: error.message}) // Log an error
            });
            }
        }
      
        const clients_list = new docs({
            filename : req.body.filename,
            fy: req.body.fy,
            month_quarter: req.body.month_quarter,
            uploadedat: req.body.uploadedat,
            purpose: req.body.purpose,
            comments: req.body.comments,
            files_uploaded: files_uploads,
            email : req.body.email,
            PAN : userPAN,
            seen : false,
            user : userid,
            lock : true,
            asked : false
        })

        await client_doc_summary.updateOne(
            {email : req.body.email, purpose:req.body.purpose},
            {$inc : {unseen: 1, total : 1}, user: userid},
            {upsert:true}
        ).then(
            (result) => {
                console.log({result}); // Log the result of 50 Pokemons
            },
            (error) => {
                // As the URL is a valid one, this will not be called.
                return res.status(400).json({Status: error.message}) // Log an error
        });

        const newDoc_client = await clients_list.save().then(
            (result) => {
                console.log({result}); // Log the result of 50 Pokemons
            },
            (error) => {
                // As the URL is a valid one, this will not be called.
                return res.status(400).json({Status: error.message}) // Log an error
        });

        res.status(201).json(newDoc_client);
    } catch (error) {
        return res.status(400).json({Status: error.message})
    }
})

//Posting asked files
router.post('/post_asked/:id' , [upload.array("files"),getDoc],async(req,res)=>{
    let userPAN
    let userid
    try {
        const user = await users.findOne({email: req.body.email})
        userPAN = user.PAN[0]
        userid = user.id

        results = []
        const files = req.files;
        let name = user.user_name + "_" + user.PAN[0];
        name = name.split("/")[0];
        let files_uploads = []
        //name.split('/')
        if(Array.isArray(files) && files.length > 0 )
        {
          for (const file of files) 
            {
              let file_name = file.filename;
              files_uploads.push(file_name);
              file.filename = req.body.fy +"/" + req.body.purpose +"/" 
              + name +"/" + req.body.filename +"/" + file.filename;
              await uploadfile({file: file}).then(
                (result) => {
                    console.log({result}); // Log the result of 50 Pokemons
                },
                (error) => {
                    // As the URL is a valid one, this will not be called.
                    return res.status(400).json({Status: error.message}) // Log an error
                });

              await unlinkfile(file.path).then(
                (result) => {
                    console.log({result}); // Log the result of 50 Pokemons
                },
                (error) => {
                    // As the URL is a valid one, this will not be called.
                    return res.status(400).json({Status: error.message}) // Log an error
            });
            }
        }        
        res.doc.filename =req.body.filename;
        res.doc.fy= req.body.fy;
        res.doc.month_quarter= req.body.month_quarter;
        res.doc.uploadedat= req.body.uploadedat;
        res.doc.purpose= req.body.purpose;
        res.doc.comments= req.body.comments;
        res.doc.files_uploaded= files_uploads;
        res.doc.email = req.body.email;
        res.doc.PAN = userPAN;
        res.doc.user = userid;
        res.doc.asked = true;
        res.doc.seen = false;
        res.doc.loc = true
        await client_doc_summary.updateOne(
            {email : req.body.email, purpose:req.body.purpose},
            {$inc : {unseen: 1, total : 1}, user: userid},
            {upsert:true}
        ).then(
            (result) => {
                console.log({result}); // Log the result of 50 Pokemons
            },
            (error) => {
                // As the URL is a valid one, this will not be called.
                return res.status(400).json({Status: error.message}) // Log an error
        });

        const newDoc = await res.doc.save().then(
            (result) => {
                console.log({result}); // Log the result of 50 Pokemons
            },
            (error) => {
                // As the URL is a valid one, this will not be called.
                return res.status(400).json({Status: error.message}) // Log an error
            });
        res.status(201).json({message:'Updated Successfully'})
    } catch (error) {
        return res.status(400).json({Status: error.message})
    }
})
//Updating One
router.put('/update/:id' ,upload.array("files"),getDoc, async(req,res)=>{
    if(req.body !=null){
        try {
            let user = await users.findOne({email: res.doc.email})
            let name = user.user_name + "_" + user.PAN[0];
            name = name.split("/")[0];

            let file_name_old = res.doc.fy +"/" + res.doc.purpose +"/" 
            + name +"/" + res.doc.filename

            user = await users.findOne({email: req.body.email})
            name = user.user_name + "_" + user.PAN[0];
            name = name.split("/")[0];

            let file_name_new = req.body.fy +"/" + req.body.purpose +"/" 
            + name +"/" + req.body.filename
            if(file_name_new ==  file_name_old){
                if(req.body.seen == 1){
                await client_doc_summary.updateOne(
                {email : req.body.email, purpose:req.body.purpose},
                {$inc : {unseen: 1}},
                {upsert:true}
                )}
            }
            else{
                if(res.doc.seen == 1){
                await client_doc_summary.updateOne(
                {email : res.doc.email, purpose:res.doc.purpose},
                {$inc : {unseen: -1,total : -1}},
                {upsert:true}
                )}
                else{
                    await client_doc_summary.updateOne(
                        {email : res.doc.email, purpose:res.doc.purpose},
                        {$inc : {total : -1}},
                        {upsert:true}
                        )
                }
                await client_doc_summary.updateOne(
                {email : req.body.email, purpose:req.body.purpose},
                {$inc : {unseen: 1, total:1}},
                {upsert:true}
                )
                let files_uploads = []
                if(Array.isArray(res.doc.files_uploaded))
                {files_uploads = res.doc.files_uploaded;}
                else{
                    files_uploads = Array(req.body.files_uploaded);
                }

                for (let file of files_uploads) 
                    { 
                    let fileKey = file;
                    sourcefileKey = file_name_old +"/" + fileKey;
                    destfileKey = file_name_new +"/" + fileKey;
                    
                    await copyfile({ sourcefileKey: sourcefileKey, destfileKey : destfileKey}).then(
                        (result) => {
                            console.log({result}); // Log the result of 50 Pokemons
                        },
                        (error) => {
                            // As the URL is a valid one, this will not be called.
                            return res.status(400).json({Status: error.message}) // Log an error
                        });
                    
                    await deletefile({fileKey:sourcefileKey}).then(
                        (result) => {
                            console.log({result}); // Log the result of 50 Pokemons
                        },
                        (error) => {
                            // As the URL is a valid one, this will not be called.
                            return res.status(400).json({Status: error.message}) // Log an error
                        }); 
                    }
            }

            res.doc.filename = req.body.filename,
            res.doc.month_quarter = req.body.month_quarter;
            res.doc.fy = req.body.fy;
            res.doc.uploadedat =  req.body.uploadedat;
            res.doc.purpose= req.body.purpose;
            res.doc.comments= req.body.comments;
            res.doc.files_uploaded= req.body.files_uploaded;
            res.doc.email = req.body.email;
            res.doc.seen = 0;
            let files_uploads = []
            if(Array.isArray(req.body.files_uploaded))
            {files_uploads = req.body.files_uploaded;}
            else{
                files_uploads = Array(req.body.files_uploaded);
            }
            console.log(files_uploads)
            if(Array.isArray(req.files) && req.files.length > 0 )
            {
            for (const file of req.files) 
                {
                console.log(file)
                let file_name = file.filename;
                files_uploads.push(file_name);
                file.filename = file_name_new +"/" + file.filename;
                await uploadfile({file: file}).then(
                    (result) => {
                        console.log({result}); // Log the result of 50 Pokemons
                    },
                    (error) => {
                        // As the URL is a valid one, this will not be called.
                        return res.status(400).json({Status: error.message}) // Log an error
                    });

                await unlinkfile(file.path).then(
                    (result) => {
                        console.log({result}); // Log the result of 50 Pokemons
                    },
                    (error) => {
                        // As the URL is a valid one, this will not be called.
                        return res.status(400).json({Status: error.message}) // Log an error
                });
                }
                res.doc.files_uploaded= files_uploads
            }
            console.log(res.doc.files_uploaded)
            await res.doc.save()
            res.status(201).json({message:'Updated Successfully'})
        } catch (error) {
            res.status(400).json({message: error.message})
        }
    }
})

//Locking the file
router.put('/lock/:id' ,getDoc, async(req,res)=>{
    if(req.body !=null){
        res.doc.lock = req.body.lock;
        try {
            const newDoc = await res.doc.save()
            res.status(201).json({message:'Updated Successfully'})
        } catch (error) {
            res.status(400).json({message: error.message})
        }
    }
})

//Dec while seeing the file
router.put('/client_summary/seen/:id',getDoc,async(req,res)=>{
    try {
        console.log({email : res.doc.email, purpose:res.doc.purpose})
        if(res.doc.seen == 0){
        await client_doc_summary.updateOne(
            {email : res.doc.email, purpose:res.doc.purpose},
            {$inc : {unseen: -1}},
            {upsert:true}
            )
        
        res.doc.seen = 1;
        const newDoc = await res.doc.save()
        return res.status(201).json({message:'Updated Successfully'})
        }
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
})

//Deleting One
router.delete('/:id' , [OpenJWT, getDoc, Access ], async(req,res)=>{
    try {
        
        if(res.doc.seen == 1){
            await client_doc_summary.updateOne(
            {email : res.doc.email, purpose:res.doc.purpose},
            {$inc : {total : -1}},
            {upsert:true}
            )
        }
        else{
            await client_doc_summary.updateOne(
            {email : res.doc.email, purpose:res.doc.purpose},
            {$inc : {unseen: -1, total : -1}},
            {upsert:true}
            )
        }
        
        const user = await users.findOne({email: res.doc.email})
        let name = user.user_name + "_" + user.PAN[0];
        let files_uploads = res.doc.files_uploaded;
        name = name.split("/")[0];
        let fileKey = res.doc.fy +"/" + res.doc.purpose +"/" 
            + name +"/" + res.doc.filename;
        for(let index=0; index < files_uploads.length; index++){
            await deletefile({fileKey:fileKey+"/"+files_uploads[index]}).then(
                (result) => {
                    console.log({result}); 
                },
                (error) => {
                    return res.status(400).json({Status: error.message}) // Log an error
                });
        } 
        await res.doc.remove().then(
            (result) => {
                console.log({result}); // Log the result of 50 Pokemons
            },
            (error) => {
                // As the URL is a valid one, this will not be called.
                return res.status(400).json({Status: error.message}) // Log an error
            });
        //res.json(result);
        res.status(200).json({message:'Deleted Successfully'});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Delete Client Doc Summary
router.get('/client_doc_summary_delete/delete/:id' , async(req,res)=>{
    try {
        
        let doc = client_doc_summary.findById(req.params.id)
        await doc.remove().then(
            (result) => {
                console.log({result}); // Log the result of 50 Pokemons
            },
            (error) => {
                // As the URL is a valid one, this will not be called.
                return res.status(400).json({Status: error.message}) // Log an error
            });
        //res.json(result);
        res.status(200).json({message:'Deleted Successfully'});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Delete All
// router.delete('/', async(req,res)=>{
//     try {
//         await docs.deleteMany();
//         await client_doc_summary.deleteMany();
//         res.status(200).json({message:'Deleted Successfully'});
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// })

async function getDoc(req,res, next)
{
    console.log("hi")
    let doc
    try {
        doc = await docs.findById(req.params.id)
        
        if(doc == null){
            return res.status(404).json({message : 'Cannot Find Doc'})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    res.doc = doc
    next()
}

async function getaskedfiles(req,res, next)
{
    console.log("hi")
    let doc
    try {
        doc = await asked_files.findById(req.params.id)
        
        if(doc == null){
            return res.status(404).json({message : 'Cannot Find Doc'})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    res.doc = doc
    next()
}

router.delete('/client_doc_summary/delete/:id',  async(req,res)=>{
    try {
        await client_doc_summary.deleteOne({_id: req.params.id}, function (err, _) {
            if (err) {
                return console.log(err);
            }
        });
        res.status(200).json({message:'Deleted Successfully'});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

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
    
    if(req.JWT.email == req.params.email || req.JWT.email == res.doc.email ){
        
      next()
    }
    else {
      const user = await users.findOne({email: req.JWT.email})
      if(user.user_type == 'auditor') {
        next()
      }
      else return res.status(403).json({'message' : 'Hello Access Denied, Invalid JWT'})
    }
  }


//Transferring Asked Files Field to DOC  with field docs added
router.get('/post_asked/from_asked_to_doc/id/1' , async(req,res)=>{
    let userPAN
    let userid
    let asked_files_id;
    try {
        
        asked_files_id = await asked_files.find()
        console.log(asked_files_id.length)
        for (let index = 0; index < asked_files_id.length; index++) {
            let doc;
            doc = asked_files_id[index]
            //console.log(asked_files[index])
            let clients_list = new docs({
                filename : doc.filename,
                fy: doc.fy,
                month_quarter: doc.month_quarter,
                purpose: doc.purpose,
                comments: doc.comments,
                files_uploaded: doc.files_uploaded,
                email : doc.email,
                PAN : doc.PAN ,               
                seen : true,
                user : doc.user,               
                lock : false,
                asked : true,
            })
            await clients_list.save().then(
            (result) => {
                console.log({result}); // Log the result of 50 Pokemons
            },
            (error) => {
                // As the URL is a valid one, this will not be called.
                return res.status(400).json({Status: error.message}) // Log an error
            });
        
        }
       
        res.status(201).json({message:'Updated Successfully'})
    } catch (error) {
        return res.status(400).json({Status: error.message})
}
})


//Adding asked field
router.get('/post_asked/from_asked_to_doc/id/2' , async(req,res)=>{
    let userPAN
    let userid
    let asked_files_id;
    try {
        
        asked_files_id = await docs.find()
        console.log(asked_files_id.length)
        for (let index = 0; index < asked_files_id.length; index++) {
            let doc;
            doc = asked_files_id[index]
            //console.log(asked_files[index])
            doc.asked = false;
            
            await doc.save().then(
            (result) => {
                console.log({result}); // Log the result of 50 Pokemons
            },
            (error) => {
                // As the URL is a valid one, this will not be called.
                return res.status(400).json({Status: error.message}) // Log an error
            });
        
        }
       
        res.status(201).json({message:'Updated Successfully'})
    } catch (error) {
        return res.status(400).json({Status: error.message})
}
})



module.exports = router