const mongoose = require('mongoose');
const inventorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
    },
    description:{
        type: String,
        required: true,
        maxLength: 100,
    },
    buyingPrice:{
        type: Number,
        required: true,
    },
    sellingPrice:{
        type: Number,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    quantity:{
        type: Number,
        required: true,
    }
})
module.exports = mongoose.model('inventoryList',inventorySchema);