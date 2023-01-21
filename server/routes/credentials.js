const express = require('express')
const router = express.Router()
const credentials = require('../models/credentials')
const bcrypt = require('bcrypt')

//Getting all
router.get('/', async (req, res) =>{
    try {
        const all_credentials = await credentials.find()
        res.json(all_credentials)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Creating one
router.post('/', async (req, res) =>{
    // const credential = await credentials.findOne({email: req.body.email, credential_type: req.body.credential_type})
    // if(credential != null) return res.status(400).json({Status : "credential already there"})

    try{
        // const salt = await bcrypt.genSalt()
        // const hashedpassword = await bcrypt.hash(req.body.password, salt)

        const credential = new credentials({
            email: req.body.email, 
            credential_type: req.body.credential_type,

            user_id : req.body.user_id,
            password : req.body.password,
        
            PAN: req.body.PAN,
            registered_mobile: req.body.registered_mobile,
            registered_email: req.body.registered_email
        })
        const newCredential = await credential.save()
        res.status(201).json(newCredential)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

// Getting all types of credentials
router.post('/all', async (req, res) =>{
    const credential = await credentials.find({email: req.body.email})

    if (credential == null) {
        return res.status(404).json({status : "404"}) // no credentials for current user
    }

    res.status(200).json(credential)
})

//Updating one
router.put('/:id', getCredentials, async(req, res) =>{
    if(req.body !=null){
        res.credential.email = req.body.email;
        res.credential.credential_type = req.body.credential_type;

        res.credential.user_id = req.body.user_id;
        res.credential.password = req.body.password;
    
        res.credential.PAN = req.body.PAN;
        res.credential.registered_mobile = req.body.registered_mobile;
        res.credential.registered_email = req.body.registered_email;
        try {
            const newCredential = await res.credential.save()
            res.status(201).json({message:'Credential Updated Successfully'})
        } catch (error) {
            res.status(400).json({message: error.message})
        }
    }
})

//Deleting one
router.delete('/:id', getCredentials, async (req, res) =>{
    try {
        await res.credential.remove()
        res.json({ message: 'Deleted Credential'})
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

async function getCredentials(req, res, next) {
    try {
        credential = await credentials.findById(req.params.id)
        if (credential == null) {
            return res.status(404).json({message: 'cannot find'})
        }
    } catch(err) {
        return res.status(500).json({ message : err.message })
    }

    res.credential = credential
    next()
}
module.exports = router