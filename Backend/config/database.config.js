const mongoose = require('mongoose');
require('dotenv').config();
const dbConnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=> console.log("connnection successful."))
    .catch((error)=>{
        console.log("connection error.")
        console.log(error.message);
        process.exit(1);
    })
}
module.exports = dbConnect;