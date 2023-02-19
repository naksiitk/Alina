const express = require('express')
const router = express.Router()
const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Login one
router.post('/', async (req, res) =>{
    const user = await User.findOne({email: req.body.email})

    if (user == null) {
        return res.status(404).json({status : "404"}) // email not found
    }

    try{
        if (await bcrypt.compare(req.body.password, user.password)) {
            const jwtToken = jwt.sign({email : user.email, role : user.user_type}, process.env.JWT_SECRET_KEY)

            res.status(200).json({status : "200", JWT: jwtToken, email : user.email, role : user.user_type}) // password correct
        }
        else {
            res.status(400).json({status : "400"}) // password incorrect
        }
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

module.exports = router