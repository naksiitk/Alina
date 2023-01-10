const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

//Getting all
router.get('/', async (req, res) =>{
    try {
        const users = await User.find()
        res.json(users)
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

        const user = new User({ email: req.body.email, password: hashedpassword})
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
        return res.status(404).json({Status : "Email not Found"})
    }

    try{
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.status(201).json({Status : "Password is correct"})
        }
        else {
            res.status(400).json({Status : "Password is incorrect"})
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

module.exports = router