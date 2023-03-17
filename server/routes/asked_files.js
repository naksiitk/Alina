const express = require('express')
const router = express.Router()
const asked_files = require('../models/asked_files')
const users = require('../models/users')
const client_doc_summary = require('../models/client_doc_summary')
const docs = require('../models/docs')
//Getting All
router.get('/asked_files/' , async (req,res)=>{
    try {
        const asked_file_list = await docs.find({asked : true}).sort({$natural:-1})
        res.json(asked_file_list)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.get('/asked_files_old/' , async (req,res)=>{
    try {
        const asked_file_list = await asked_files.find().sort({$natural:-1})
        res.json(asked_file_list)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Getting One
router.get('/asked_files/:id' , async (req,res)=>{
    try {
        const asked_file_list = await docs.find({email : req.params.id,asked : true}).sort({$natural:-1})
        res.json(asked_file_list)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Getting asked_files based on purpose not yet submitted
router.post('/asked_files/purpose' , async (req,res)=>{
    try {
        const asked_file_list = await docs.find({email : req.body.email, purpose : req.body.purpose, asked : true, files_uploaded : []}).sort({$natural:-1})
        res.json(asked_file_list)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Creating One
router.post('/asked_files' , async(req,res)=>{
    let userPAN
    let userid
    console.log(req.body)
    try {
        const user = await users.findOne({email: req.body.email})
        if(user!= null){
        userPAN = user.PAN[0]
        userid = user.id}
        else{
            res.status(500).json({message: "Email-id not there"})
        }
    
    const asked_clients_list = new docs({
        filename : req.body.filename,
        fy: req.body.fy,
        month_quarter : req.body.month_quarter,
        purpose: req.body.purpose,
        comments: req.body.comments,
        email : req.body.email,
        PAN : userPAN,
        user : userid,
        files_uploaded : [],
        seen : true,
        lock : false,
        asked : true
    })  
        await client_doc_summary.updateOne(
            {email : req.body.email, purpose:req.body.purpose},
            {$inc : {total : 1}, user: userid},
            {upsert:true}
        ).then(
            (result) => {
                console.log({result}); // Log the result of 50 Pokemons
            },
            (error) => {
                // As the URL is a valid one, this will not be called.
                return res.status(400).json({Status: error.message}) // Log an error
        });

        const newasked_file_client = await asked_clients_list.save()
        res.status(201).json(newasked_file_client);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
//Updating One
router.put('asked_files/update/:id' ,getasked_file, async(req,res)=>{
    if(req.body !=null){
        res.asked_file.filename = req.body.filename,
        res.asked_file.fy = req.body.fy;
        res.asked_file.month_quarter = req.body.month_quarter;
        res.asked_file.purpose= req.body.purpose;
        res.asked_file.comments= req.body.comments;
        res.asked_file.email = req.body.email;
        try {
            const newasked_file = await res.asked_file.save()
            res.status(201).json({message:'Updated Successfully'})
        } catch (error) {
            res.status(400).json({message: error.message})
        }
    }
    
})
//Deleting One
router.delete('/asked_files/:id' ,getasked_file, async(req,res)=>{
    try {
        await res.asked_file.remove();
        res.status(200).json({message:'Deleted Successfully'});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
//Delete All
router.delete('/asked_files', async(req,res)=>{
    try {
        await asked_files.deleteMany();
       
        res.status(200).json({message:'Deleted Successfully'});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

async function getasked_file(req,res, next)
{
    let asked_file
    try {
        asked_file = await docs.findById(req.params.id)
        if(asked_file == null){
            return res.status(404).json({message : 'Cannot Find asked_file'})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    res.asked_file = asked_file
    next()
}
module.exports = router