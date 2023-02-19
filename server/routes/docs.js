const express = require('express')
const router = express.Router()
const docs = require('../models/docs')
const users = require('../models/users')
const client_doc_summary = require('../models/client_doc_summary')

//Getting All
router.get('/' , async (req,res)=>{
    try {
        const doc_list = await docs.find()
        res.json(doc_list)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
//Getting One
router.get('/:id' , async (req,res)=>{
    try {
        const doc_list = await docs.find({email : req.params.id})
        res.json(doc_list)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
//Getting Client Distinct
router.get('/client_list/:id' , async (req,res)=>{
    try {
        const clients_list = await client_doc_summary.find({purpose : req.params.id}).populate('user','user_name PAN')
        res.json(clients_list)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


//Getting docs based on purpose
router.post('/purpose' , async (req,res)=>{
    try {
        const doc_list = await docs.find({email : req.body.email, purpose : req.body.purpose})
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
        lock : false,
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
//Updating One
router.put('/update/:id' ,getDoc, async(req,res)=>{
    if(req.body !=null){
        res.doc.filename = req.body.filename,
        res.doc.month_quarter = req.body.month_quarter;
        res.doc.fy = req.body.fy;
        res.doc.uploadedat =  req.body.uploadedat;
        // res.doc.file_name= req.body.file_name;
        res.doc.purpose= req.body.purpose;
        res.doc.comments= req.body.comments;
        res.doc.files_uploaded= req.body.files_uploaded;
        res.doc.email = req.body.email;
        res.doc.seen = 0;
        try {
            if(req.body.purpose ==  res.doc.purpose){
                await client_doc_summary.updateOne(
                {email : req.body.email, purpose:req.body.purpose},
                {$inc : {unseen: 1}},
                {upsert:true}
                )
            }
            else{
                await client_doc_summary.updateOne(
                {email : res.doc.email, purpose:res.doc.purpose},
                {$inc : {unseen: -1,total : -1}},
                {upsert:true}
                )

                await client_doc_summary.updateOne(
                {email : req.body.email, purpose:req.body.purpose},
                {$inc : {unseen: 1, total:1}},
                {upsert:true}
                )
            }
            const newDoc = await res.doc.save()
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
        if(res.doc.seen == 0){
        await client_doc_summary.updateOne(
            {email : res.doc.email, purpose:res.doc.purpose},
            {$inc : {unseen: -1}},
            {upsert:true}
            )
        res.doc.seen = 1;
        const newDoc = await res.doc.save()
        res.status(201).json({message:'Updated Successfully'})
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Deleting One
router.delete('/:id' , [OpenJWT, Access, getDoc], async(req,res)=>{

    try {
        await client_doc_summary.updateOne(
            {email : res.doc.email, purpose:res.doc.purpose},
            {$inc : {unseen: -1, total : -1}},
            {upsert:true}
            )
        await res.doc.remove();
        res.status(200).json({message:'Deleted Successfully'});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
//Delete All
router.delete('/', async(req,res)=>{
    try {
        await docs.deleteMany();
        await client_doc_summary.deleteMany();
        res.status(200).json({message:'Deleted Successfully'});
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
    if(req.JWT.email == req.params.email) {
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
module.exports = router