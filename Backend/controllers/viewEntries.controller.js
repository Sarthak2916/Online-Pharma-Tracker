const inventoryModel = require('../models/inventory.model');

exports.view = async(req,res) => {
    try{
        const response = await inventoryModel.find();
        res.status(200).json({
            viewMedicines:response,
        });
    }
    catch(error){
        res.status(400).json({
            success: false,
            error: error.message,
            message:'Server error. Try again',
        })
    }
}
