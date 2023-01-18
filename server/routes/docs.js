const express = require('express')
const router = express.Router()
const docs = require('../models/docs')
const users = require('../models/docs')

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
//Creating One
router.post('/' , async(req,res)=>{
    let userPAN

    try {
        const user = await users.findOne({email: req.body.email})
        userPAN = user.PAN
    } catch (error) {
        res.status(500).json({message: error.message})
    }
    const clients_list = new docs({
        file_name: req.body.file_name,
        purpose: req.body.purpose,
        comments: req.body.comments,
        files_uploaded: req.body.files_uploaded,
        email : req.body.email,
        PAN : userPAN,
        seen : false
    })
    try {
        const newDoc_client = await clients_list.save()
        res.status(201).json(newDoc_client)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
//Updating One
router.put('/:id' ,getDoc, async(req,res)=>{
    if(req.body !=null){
        res.doc.file_name= req.body.file_name;
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
//Deleting One
router.delete('/:id' ,getDoc, async(req,res)=>{
    try {
        await res.doc.remove();
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