const registerModel = require('../models/user.registerModel')
const bcrypt = require('bcryptjs')
exports.registerUser = async(req,res) =>{
    try{
        const {name,email,password,confirm_password} = req.body;
        if(password!=confirm_password){
            res.status(400).send("password did not match");
        }
        else{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            const response = await registerModel.create({name,email,password:hashedPassword});
            res.status(200).json({
                success:true,
                data:response,
                message:'User Created Successfully',
            });
        }
    }
    catch(error){
        console.error(error);
        res.status(500)
        .json({
            success: false,
            message: error.message,
        })
    }
}