require('dotenv').config();
// A passport strategy for authenticating with a JSON Web token
// This allows us to authenticate endpoints using a token.
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose');
//Option 1
// const db = require('../models')
//Option 2
const User = require('../models/User')

const options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// JWT_SECRET is inside of our enviroment.
options.secretOrKey = process.env.JWT_SECRET;



module.exports = (passport) => {
    passport.use(new JwtStrategy(options, (jwt_payload, done)=>{
        //Have a user that we're going to find by the ID in the payload
        //When we get a user back, we will check to see if user is in teh database.
        User.findById(jwt_payload.id)
        .then(user => {
            //jwt_payload is an object literal that contains the decoded json token payload
            //done is a callback that has a error first as an arguement done(error, user, info)
            if (user) {
                //if a user is found, return null for err and the user
                return done(null, user)
            } else {
                //No User was found
                return done(null, false)
            }
        })
        .catch(error => console.log(error));
    }))
}