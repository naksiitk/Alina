const express = require('express')
const router = express.Router()
const credentials = require('../models/credentials')
const users = require('../models/users')
const bcrypt = require('bcrypt')

// Getting all
router.get('/', async (req, res) =>{
    try {
        const all_credentials = await credentials.find()
        res.json(all_credentials)
    } catch (error) {
        res.status(500).json({message: error.message})
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

//Creating one
router.post('/add_new_credential', [OpenJWT, Access], async (req, res) =>{
    const credential = await credentials.findOne({email: req.body.email, PANorGSTIN: req.body.PANorGSTIN})
    if(credential != null) return res.status(400).json({ message : "Credential Already Exists"})

    try{
        const client = await users.findOne({email : req.body.email})

        if(req.body.credential_type == 'GST') {
            let status
            let gsterror

            await checkGSTstatus({PANorGSTIN : req.body.PANorGSTIN})
            .then((GSTstatusres) => {
                status = GSTstatusres.status

                if(GSTstatusres.status != 200) gsterror = GSTstatusres.error.message
                else console.log('GSTIN is correct')
            })

            if(status !=200) return res.status(status).json({message : gsterror})
        }

        const credential = new credentials({
            email: req.body.email, 
            credential_type: req.body.credential_type,

            user_id : req.body.user_id,
            password : req.body.password,

            PANorGSTIN : req.body.PANorGSTIN,

            registered_mobile: req.body.registered_mobile,
            registered_email: req.body.registered_email,

            user: client._id
        })
        const newCredential = await credential.save()
        return res.status(201).json(newCredential)
    } catch (err) {
        return res.status(400).json({ message: err.message})
    }
})

router.get('/auditor/all/purpose/:id', [OpenJWT, IsAuditor],async (req,res) => {
    try {
        const All_credentials = await credentials.find({credential_type: req.params.id}).populate('user','user_name PAN')
        if(All_credentials == null) return res.status(404).json({message : 'No credentials found'})
        return res.status(200).json(All_credentials)
    } catch (err) {
        return res.status(500).json({ message : err.message })
    }
})

router.get('/client/all', [OpenJWT, IsClient],async (req,res) => {
    try {
        const All_credentials = await credentials.find({email: req.JWT.email})
        if(All_credentials == null) return res.status(404).json({message : 'No credentials found'})
        return res.status(200).json(All_credentials)
    } catch (err) {
        return res.status(500).json({ message : err.message })
    }
})

//Deleting one
router.post('/delete/:id', [OpenJWT], async (req, res) =>{
    try {
        const credential = await credentials.findById(req.params.id)
        if(credential == null) return res.status(404).json({message : 'Credential not found in database'})
        if(credential.email != req.JWT.email && req.JWT.user_type != 'auditor') return res.status(400).json({message: 'Access Denied'})
        await credential.remove()
        res.status(200).json({ message: 'Deleted Credential'})
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

const JWT = require('jsonwebtoken')
const { checkGSTstatus } = require('../services/gst')

function OpenJWT(req, res, next) {
    const authHeader = req.headers.authorization
    const Token = authHeader && authHeader.split(' ')[1]

    if(Token == null) return res.status(401).json({message : 'No JWT in request, Please login'})

    JWT.verify(Token, process.env.JWT_SECRET_KEY , async (err, decodedJWT) => {
        if(err) return res.status(403).json({message : 'Access Denied, Invalid JWT'})
        const user = await users.findOne({ email : decodedJWT.email})
        req.JWT = user
        return next()
    })
}

async function Access(req, res, next) {
    if(req.JWT.email == req.body.email) return next()

    const user = await users.findOne({email: req.JWT.email})
    if(user.user_type == 'auditor') return next()
    
    else return res.status(403).json({message : 'Access Denied for given email'})
}

async function IsAuditor(req, res, next) {
    const user = await users.findOne({email: req.JWT.email})
    if(user.user_type == 'auditor') return next()
    
    else return res.status(403).json({message : 'Access Denied, You are not Auditor'})
}

async function IsClient(req, res, next) {
    const user = await users.findOne({email: req.JWT.email})
    if(user.user_type == 'client') return next()
    
    else return res.status(403).json({message : 'Access Denied, You are not Client'})
}


module.exports = router