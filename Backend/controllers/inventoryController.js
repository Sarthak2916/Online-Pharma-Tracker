const inventoryModel = require('../models/inventory.model');
const { findOneAndDelete } = require('../models/user.registerModel');

exports.addMed = async(req,res) => {
    try{
        const {name, description, buyingPrice, sellingPrice, location, quantity} = req.body;
        const response = await inventoryModel.create({
            name, 
            description, 
            buyingPrice, 
            sellingPrice, 
            location, 
            quantity
        });
        res.status(200).json({
            success:true,
            data:response,
            message:'Entry Created Successfully',
        });
    }
    catch(error){
        console.error('Error adding medicine:', error);
        res.status(400).json({
            success: false,
            error: error.message,
            message:'Server error. Try again',
        })
    }
}

exports.deleteMed = async(req,res) => {
    try{
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Medicine name is required"
            });
        }

        const entry = await inventoryModel.findOne({ name });
        if(!entry){
            return res.status(404).json({
                success: false,
                message: "Medicine not found"
            });
        }

        await inventoryModel.findOneAndDelete({ name });
        res.status(200).json({
            success: true,
            message: "Medicine deleted successfully"
        });
    }
    catch(error){
        console.error('Error deleting medicine:', error);
        res.status(400).json({
            success: false,
            error: error.message,
            message: 'Server error. Try again'
        });
    }
}

exports.updateMedQty = async(req,res) => {
    try{
        const {name, quantity} = req.body;
        const entry = await inventoryModel.findOne({name});
        
        if(!entry){
            return res.status(404).json({
                success: false,
                message: "Medicine not found"
            });
        }

        // Calculate new quantity by subtracting purchased quantity
        const newQuantity = entry.quantity - quantity;
        
        // Check if we have enough stock
        if(newQuantity < 0) {
            return res.status(400).json({
                success: false,
                message: `Not enough stock for ${name}. Available: ${entry.quantity}`
            });
        }

        // Update with new quantity
        await inventoryModel.findOneAndUpdate(
            {name}, 
            {quantity: newQuantity},
            {new: true}
        );

        res.status(200).json({
            success: true,
            message: `Quantity for ${name} updated successfully`,
            newQuantity: newQuantity
        });
    }
    catch(error){
        console.error('Update quantity error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Try again',
            error: error.message
        });
    }
};

exports.updateMed = async(req,res) => {
    try {
        console.log('Update Medicine Request Body:', req.body);
        
        const { originalName, ...updateData } = req.body;
        console.log(originalName)
        if (!originalName) {
            console.error('No original name provided');
            return res.status(400).json({
                success: false,
                message: "Medicine name is required"
            });
        }

        const entry = await inventoryModel.findOne({ name: originalName });
        if (!entry) {
            console.error(`Medicine not found with name: ${originalName}`);
            return res.status(404).json({
                success: false,
                message: "Medicine not found"
            });
        }

        const updatedMedicine = await inventoryModel.findOneAndUpdate(
            { name: originalName },
            { $set: updateData },
            { new: true }
        );

        if (!updatedMedicine) {
            console.error(`Failed to update medicine with name: ${originalName}`);
            return res.status(500).json({
                success: false,
                message: "Failed to update medicine"
            });
        }

        console.log('Medicine updated successfully:', updatedMedicine);
        res.status(200).json({
            success: true,
            message: "Medicine updated successfully",
            data: updatedMedicine
        });
    } catch (error) {
        console.error('Error updating medicine:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Server error. Try again'
        });
    }
};