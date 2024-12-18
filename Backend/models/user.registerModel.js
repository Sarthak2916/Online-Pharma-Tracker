const mongoose = require("mongoose")
let validator =require('validator');
const registerSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxLength: 50,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate: {
            validator:validator.isEmail,
            message: "Email not valid",
        }
    },
    password:{
        type: String,
        required: true,
    },
    confirm_password:{
        type: String,
        required: false,
    }

})
module.exports= mongoose.model('userList',registerSchema);