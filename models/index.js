require('dotenv').config();
const mongoose = require('mongoose');

//Mongo connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
});

//Mongoose connection object
const db = mongoose.connection;
// console.log(db);

//Set up and event listener that will fire once the connection opens for the datatbase
//Log to terminal what host and port we are on
db.once('open',()=>{
    console.log(`Connected to MongoDB at ${db.host}:${db.port}`);
})

db.on('error', (error)=>{
    console.log(`Database error \n ${error}`);
})

const User = require('./User')
module.exports = User; 