const express = require('express')
const router = express.Router()
const User = require('../models/users')
const otp = require('../models/otp')
const bcrypt = require('bcrypt')
const client_doc_summary = require('../models/client_doc_summary')
const { generateOTP } = require('../services/otp'); 
const { sendOTP_mail, onboard_mail, ask_mail, reminder_mail, delete_mail, verified_mail } = require('../services/mail')

//Getting all
router.get('/', async (req, res) =>{
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
//Getting Verified Users
router.get('/verified', async (req, res) =>{
    try {
        const users = await User.find({verified: false}).sort({$natural:-1})
        res.json(users)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Update verified check 
router.post('/verified/check', async (req, res) =>{
    try {
        console.log(req.body.email)
        const user = await User.updateOne(
            {email : req.body.email},
            {verified: req.body.verified}
        )
        res.status(200).json({message: "Verified Successfully"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
//Getting Clinet_doc_summary
router.get('/client_doc_summary', async (req, res) =>{
    try {
        const users = await client_doc_summary.find().sort({$natural:-1})
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
            company_name: req.body.user_name,
            verified: true
        })
        
        const newUser = await user.save();

        // const client_doc = new client_doc_summary({
        //     unseen : 0,
        //     total : 0,
        //     email : req.body.email,
        //     user : newUser.id,
        // });
        // client_doc.save()

        //const newUser = await user.saveInstance();
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

//Updating one
router.patch('/:id', getUser, async(req, res) =>{
    res.user.email =  req.body.email, 
    res.user.mobile = req.body.mobile,
    res.user.user_name =  req.body.user_name,
    res.user.user_type = req.body.user_type,
    res.user.PAN = req.body.PAN,
    res.user.company_name =  req.body.user_name
    const newDoc = await res.user.save().then(
        (result) => {
            console.log({result}); // Log the result of 50 Pokemons
        },
        (error) => {
            // As the URL is a valid one, this will not be called.
            return res.status(400).json({Status: error.message}) // Log an error
        });

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

//Deleting email
router.delete('/email/:id', async (req, res) =>{
    try {
        console.log(req.params.id)
        await delete_mail({to: req.params.id});
        await User.deleteOne({email : req.params.id})
        await client_doc_summary.deleteMany({email : req.params.id})
        
        res.json({ message: 'Deleted Subscriber'})
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

router.delete('/delete_client_doc_summary/delete', async (req, res) =>{
    try {
       await client_doc_summary.deleteMany()   
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
   

    req.body.PAN = req.body.PAN.toUpperCase() 
    let PAN1 = req.body.PAN.toString()
    const regex = new RegExp('[A-Z]{5}[0-9]{4}[A-Z]');
    if(!regex.test(PAN1)) return res.status(400).json({Status : "PAN incorrect AAAAA5555A"})

    
    const user = await User.findOne({email: req.body.email})
    if(user != null) return res.status(400).json({Status : "Email already there"})
    
    const OTP_in_db = await otp.findOne({email: req.body.email})
    if(!OTP_in_db) return res.status(400).json({Status : "OTP expired"})

    if(OTP_in_db.OTP != req.body.OTP) return res.status(400).json({Status : "OTP not correct"})

    
    
    try{
        const salt = await bcrypt.genSalt()
        let hashedpassword = await bcrypt.hash(req.body.password, salt)

        if(req.body.password == "temporary"){
            hashedpassword = "temporary" 
        }
        const user = new User({ 
            email: req.body.email, 
            password: hashedpassword,
            mobile: req.body.mobile,
            user_name: req.body.user_name,
            user_type: req.body.user_type,
            PAN: req.body.PAN,
            company_name: req.body.user_name,
            verified: true,
        })
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})
//Change Password
router.post('/password_change', async (req, res) =>{
    const user = await User.findOne({email: req.body.email})
    if(user == null) return res.status(400).json({Status : "Error Occured"})
    try{
        const salt = await bcrypt.genSalt()
        const hashedpassword = await bcrypt.hash(req.body.password, salt)
        const update_pass = await User.updateOne(
            {email : req.body.email},
            {password: hashedpassword});
            res.status(201).json(update_pass)
        }
        catch (err) {
            res.status(400).json({ message: err.message})
        }

})

//Otp Verification
router.post('/otp_verification', async (req, res) =>{
    const user = await User.findOne({email: req.body.email})
    
    const OTP_in_db = await otp.findOne({email: req.body.email})
    if(!OTP_in_db) return res.status(400).json({Status : "OTP expired"})

    if(OTP_in_db.OTP != req.body.OTP) return res.status(400).json({Status : "OTP not correct"})

    return res.status(200).json({Status : "OTP Verified"})
})

//Generating OTP // Removing old OTP if generated
router.post('/generate_otp', async (req, res) =>{
    console.log(req.body.email)
    const user = await User.findOne({email: req.body.email})
    if(user != null) return res.status(400).json({Status : "Email already exists"})

    const otpGenerated = generateOTP();

    const oldOTP = await otp.findOne({email: req.body.email})
    if(oldOTP != null) {
        try {
            await oldOTP.remove()
        } catch (err) {
            return res.status(201).json({Status : "Cannot remove old OTP from data"})
        }
    }
    const otp_for_db = new otp({ 
        email: req.body.email, 
        OTP: otpGenerated
    })

    const newOTP = await otp_for_db.save()
    
    try {
        await sendOTP_mail({to: req.body.email, OTP: otpGenerated});
        return res.status(201).json({Status : "OTP Send to the email!"})
    } catch (error) {
        return res.status(400).json({Status : "Cannot Send OTP"})
    }
})


//Generating OTP // Removing old OTP if generated
router.post('/generate_otp_forgot_otp', async (req, res) =>{

    const user = await User.findOne({email: req.body.email})
    if(user == null) return res.status(400).json({Status : "Email Not Present"})

    const otpGenerated = generateOTP();

    const oldOTP = await otp.findOne({email: req.body.email})
    if(oldOTP != null) {
        try {
            await oldOTP.remove()
        } catch (err) {
            return res.status(201).json({Status : "Cannot remove old OTP from data"})
        }
    }
    const otp_for_db = new otp({ 
        email: req.body.email, 
        OTP: otpGenerated
    })

    const newOTP = await otp_for_db.save()
    
    try {
        await sendOTP_mail({to: req.body.email, OTP: otpGenerated});
        return res.status(201).json({Status : "OTP Send to the email!"})
    } catch (error) {
        return res.status(400).json({Status : "Cannot Send OTP"})
    }
})
router.get('/onboarding/:email', async (req, res) =>{

    const user = await User.findOne({email: req.params.email})
    if(user != null) return res.status(400).json({Status : "Email already exists"})
    try {
        await onboard_mail({to: req.params.email});
        return res.status(201).json({Status : "Mail_sent!"})
    } catch (error) {
        return res.status(400).json({Status : "Cannot Send Mail"})
    }
})

router.post('/reminder', async (req, res) =>{
    console.log(req.body)
    const user = await User.findOne({email: req.body.email})
    if(user == null) return res.status(400).json({Status : "Email Not present"})
    try {
        await reminder_mail(req.body);
        return res.status(201).json({Status : "Mail_sent!"})
    } catch (error) {
        return res.status(400).json({Status : "Cannot Send Mail"})
    }
})
router.post('/ask_file_mail', async (req, res) =>{

    const user = await User.findOne({email: req.body.email})
    if(user == null) return res.status(400).json({Status : "Some Email require signup"})
    try {
        await ask_mail(req.body);
        return res.status(201).json({Status : "Mail_sent!"})
    } catch (error) {
        return res.status(400).json({Status : "Cannot Send Mail"})
    }
})

//setTimeout(ask_mail, 500);


module.exports = router