const express = require('express');
const router = express.Router();
const {getMessages,sendMessage}= require('../controllers/messageController');

// Route to send message to all customers
router.post('/send-message', sendMessage);

// Route to get all messages
router.get('/messages', getMessages);

module.exports = router;