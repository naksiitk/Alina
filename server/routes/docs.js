const express = require('express')
const router = express.Router()
const docs = require('../models/docs')
const users = require('../models/users')
const client_doc_summary = require('../models/client_doc_summary')
const { faSleigh } = require('@fortawesome/free-solid-svg-icons')

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
        fy_month_quarter: req.body.fy_month_quarter,
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
        res.doc.fy_month_quarter = req.body.fy_month_quarter;
        res.doc.uploadedat =  req.body.uploadedat;
        // res.doc.file_name= req.body.file_name;
        res.doc.purpose= req.body.purpose;
        res.doc.comments= req.body.comments;
        res.doc.files_uploaded= req.body.files_uploaded;
        res.doc.email = req.body.email;
        try {
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
//Deleting One
router.delete('/:id' ,getDoc, async(req,res)=>{
    try {
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
module.exports = router