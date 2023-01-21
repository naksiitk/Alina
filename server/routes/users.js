const express = require('express')
const router = express.Router()
const User = require('../models/users')
const otp = require('../models/otp')
const bcrypt = require('bcrypt')
const { generateOTP } = require('../services/otp'); 
const { sendOTP_mail } = require('../services/mail')

//Getting all
router.get('/', async (req, res) =>{
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Getting all stored OTPs
router.get('/otps', async (req, res) =>{
    try {
        const all_stored_otp = await otp.find()
        res.json(all_stored_otp)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Getting One
router.get('/:id', getUser, (req, res) =>{
    res.json(res.user)
})

//Creating one
router.post('/', async (req, res) =>{
    const user = await User.findOne({email: req.body.email})
    if(user != null) return res.status(400).json({Status : "Email already there"})

    try{
        const salt = await bcrypt.genSalt()
        const hashedpassword = await bcrypt.hash(req.body.password, salt)

        const user = new User({ 
            email: req.body.email, 
            password: hashedpassword,
            mobile: req.body.mobile,
            user_name: req.body.user_name,
            user_type: req.body.user_type,
            PAN: req.body.PAN,
            company_name: req.body.user_name
        })
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

// Login one
router.post('/login', async (req, res) =>{
    const user = await User.findOne({email: req.body.email})

    if (user == null) {
        return res.status(404).json({status : "404"}) // email not found
    }

    try{
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.status(201).json({status : "200"}) // password correct
        }
        else {
            res.status(400).json({status : "400"}) // password incorrect
        }
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

//Updating one
router.patch('/:id', getUser, (req, res) =>{
    
})

//Deleting one
router.delete('/:id', getUser, async (req, res) =>{
    try {
        await res.user.remove()
        res.json({ message: 'Deleted Subscriber'})
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

async function getUser(req, res, next) {
    try {
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({message: 'cannot find'})
        }
    } catch(err) {
        return res.status(500).json({ message : err.message })
    }

    res.user = user
    next()
}

//Check OTP and save user in database
router.post('/signup', async (req, res) =>{
    const user = await User.findOne({email: req.body.email})
    if(user != null) return res.status(400).json({Status : "Email already there"})
    
    const OTP_in_db = await otp.findOne({email: req.body.email})
    if(!OTP_in_db) return res.status(400).json({Status : "OTP expired"})

    if(OTP_in_db.OTP != req.body.OTP) return res.status(400).json({Status : "OTP not correct"})

    try{
        const salt = await bcrypt.genSalt()
        const hashedpassword = await bcrypt.hash(req.body.password, salt)

        const user = new User({ 
            email: req.body.email, 
            password: hashedpassword,
            mobile: req.body.mobile,
            user_name: req.body.user_name,
            user_type: req.body.user_type,
            PAN: req.body.PAN,
            company_name: req.body.user_name
        })
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

//Creating one
router.post('/generate_otp', async (req, res) =>{
    const user = await User.findOne({email: req.body.email})
    if(user != null) return res.status(400).json({Status : "Email already exists"})

    const otpGenerated = generateOTP();

    console.log(otpGenerated)
    try {
        await sendOTP_mail({to: req.body.email, OTP: otpGenerated});
    } catch (error) {
        return res.status(400).json({Status : "Cannot Send OTP"})
    }

    const otp_for_db = new otp({ 
        email: req.body.email, 
        OTP: otpGenerated
    })

    const newOTP = await otp_for_db.save()
    res.status(201).json({Status : "OTP Send to the email!"})

})

module.exports = router