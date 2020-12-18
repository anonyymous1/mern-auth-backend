//Imports
require('dotenv').confiq;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JWT_SECRET = process.env.JWT_SECRET

//Models
// const User = require('../models/User')
const db = require('../models');

//GET Route for api/user/test (Public)
router.get('/test', (req, res) => {
    res.json({msg: 'User endpoint is OK'})
});

//POST Route for api/users.register (Public)
router.post('/register', (req, res)=>{
    //Find user by email
    db.User.findOne({ email: req.body.email})
    .then(user =>{
        //If email already exist we want to send a 400 response
        if (user) {
            return res.status(400).json({ msg: 'Email already exist'})
        } else {
            //Create a new user
            const newUser = new db.User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            //Salt and has password, then save the user
            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw Error;

                bcrypt.hash(newUser.password, salt, (error, hash) =>{
                    if (error) throw Error;
                    //Change password in newUser to hash
                    newUser.password = hash;
                    newUser.save()
                    .then(createdUser => res.json(createdUser))
                    .catch(err => console.log(err));
                })
            })
        }
    })
})

//POST Route api/users/login (Public)
router.post('/login', (req, res)=> {
    const email = req.body.email
    const password = req.body.password

    //Find a iser via email
    db.User.findOne({ email })
    .then(user => {
        console.log(user);
        //if no user
        if (!user) {
            res.status(400).json({ msg: 'User not Found' })
        } else {
        // User found in the db
            bcrypt.compare(password, user.password)
            .then(isMatch => {
                //Check password for match
                if (isMatch) {
                    console.log(isMatch);
                    //User match, send a JSON Web Token
                    //Create token payload
                    const payload = {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    };

                    //Sign token
                    // 3600000 is 1 hour
                    jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (error, token)=> {
                        res.json({
                            success: true,
                            token: `Bearer ${token}`
                        });
                    });
                } else {
                    return res.status(400).json({ password: 'Email or Password is incorrect' })
                }
            })
        }
    })
})

//
router.get('/current', passport.authenticate('jwt', { session: false }),(req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })

})

module.exports = router;