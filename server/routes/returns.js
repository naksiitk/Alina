const express = require('express')
const router = express.Router()
const returns = require('../models/returns')
const users = require('../models/users')


//Getting All
router.get('/' , async (req,res)=>{
    try {
        const return_list = await returns.find()
        res.json(return_list)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
//Getting One
router.get('/:id' , async (req,res)=>{
    try {
        const return_list = await returns.find({email : req.params.id})
        res.json(return_list)
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
        userPAN = user.PAN[0];
        userid = user.id;
    } catch (error) {
        res.status(500).json({message: error.message})
    }
    const clients_list = new returns({
        uploadedname : req.body.filename,
        // fy_month_quarter: req.body.fy_month_quarter,
        uploaded_date: req.body.uploadedat,
        purpose: req.body.purpose,
        // comments: req.body.comments,
        files_uploaded: req.body.files_uploaded,
        email : req.body.email,
        PAN : userPAN,
        user : userid
    })

    // await client_return_summary.updateOne(
    //     {email : req.body.email, purpose:req.body.purpose},
    //     {$inc : {unseen: 1, total : 1}, user: userid},
    //     {upsert:true}
    // )
    try {
        const newreturn_client = await clients_list.save()
        res.status(201).json(newreturn_client);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
//Updating One
router.put('/:id' ,getreturn, async(req,res)=>{
    if(req.body !=null){
        res.return.uploadedname = req.body.uploadedname,
        // res.return.fy_month_quarter = req.body.fy_month_quarter;
        res.return.uploaded_date =  req.body.uploaded_date;
        // res.return.file_name= req.body.file_name;
        res.return.purpose= req.body.purpose;
        res.return.comments= req.body.comments;
        res.return.files_uploaded= req.body.files_uploaded;
        res.return.email = req.body.email;
        try {
            const newreturn = await res.return.save()
            res.status(201).json({message:'Updated Successfully'})
        } catch (error) {
            res.status(400).json({message: error.message})
        }
    }
    
})
//Deleting One
router.delete('/:id' ,getreturn, async(req,res)=>{
    try {
        await res.return.remove();
        res.status(200).json({message:'Deleted Successfully'});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
//Delete All
router.delete('/', async(req,res)=>{
    try {
        await returns.deleteMany();
        res.status(200).json({message:'Deleted Successfully'});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


async function getreturn(req,res, next)
{
    let returns
    try {
        returns = await returns.findById(req.params.id)
        if(returns == null){
            return res.status(404).json({message : 'Cannot Find return'})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    res.return = returns
    next()
}
module.exports = router