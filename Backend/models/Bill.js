const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    medicines: [{
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        buyingPrice: {
            type: Number,
            required: true
        }
    }],
    price: {
        type: Number,
        required: true,
    },
    totalBuyingPrice: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Bill', billSchema);
