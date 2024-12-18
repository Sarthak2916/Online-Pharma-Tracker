const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    recipients: [{
        name: String,
        mobile: String
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Message', messageSchema);
