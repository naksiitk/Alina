const express = require('express')
const router = express.Router()
const Doc_client = require('../models/doc_clients')

//Getting All
router.get('/' , async (req,res)=>{
    try {
        const clients_list = await Doc_client.find()
        res.json(clients_list)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
//Getting One
router.get('/:id' , async (req,res)=>{
    try {
        const clients_list = await Doc_client.find({email : req.params.id})
        res.json(clients_list)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
//Creating One
router.post('/' , async(req,res)=>{
    const clients_list = new Doc_client({
        file_name: req.body.file_name,
        purpose: req.body.purpose,
        comments: req.body.comments,
        files_uploaded: req.body.files_uploaded,
        email : req.body.email
    })
    try {
        const newDoc_client = await clients_list.save()
        res.status(201).json(newDoc_client)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
//Updating One
router.put('/:id' ,get_the_client, async(req,res)=>{
    if(req.body !=null){
        res.client.file_name= req.body.file_name;
        res.client.purpose= req.body.purpose;
        res.client.comments= req.body.comments;
        res.client.files_uploaded= req.body.files_uploaded;
        res.client.email = req.body.email;
        try {
            const newDoc_client = await res.client.save()
            res.status(201).json({message:'Updated Successfully'})
        } catch (error) {
            res.status(400).json({message: error.message})
        }
    }
    
})
//Deleting One
router.delete('/:id' ,get_the_client, async(req,res)=>{
    try {
        await res.client.remove();
        res.status(200).json({message:'Deleted Successfully'});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


async function get_the_client(req,res, next)
{
    let client
    try {
        client = await Doc_client.findById(req.params.id)
        if(client == null){
            return res.status(404).json({message : 'Cannot Find Subscirber'})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    res.client = client
    next()
}
module.exports = router