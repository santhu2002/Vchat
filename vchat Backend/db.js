const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoURI =process.env.MONGO_URI

const connectToMongo =()=>{
    mongoose.connect(mongoURI).then(()=>{
        console.log("Connected to MongoDB");
    }).catch((error)=>{
        console.log("Error connecting to MongoDB");
        console.log(error);
    })
}

module.exports = connectToMongo