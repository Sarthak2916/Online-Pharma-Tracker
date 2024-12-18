const Message = require('../models/messages');
const Bill = require('../models/Bill');
const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();

const accountSid = 'AC5275d6cf6b7cc0e6ac510556ac936dd9';
const authToken = process.env.Auth_Token;
const client = twilio(accountSid, authToken);

// Send message to all customers
exports.sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Message content is required'
            });
        }

        console.log('Fetching customer numbers...');
        // Get all unique customer numbers from bills
        const bills = await Bill.find().select('name mobile -_id');
        
        if (!bills || bills.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No customers found in the database'
            });
        }

        const uniqueCustomers = Array.from(new Map(bills.map(bill => 
            [bill.mobile, { name: bill.name, mobile: bill.mobile }]
        )).values());

        console.log(`Found ${uniqueCustomers.length} unique customers`);

        // Send message to each customer
        const sendPromises = uniqueCustomers.map(async customer => {
            try {
                console.log(`Sending message to ${customer.name} (${customer.mobile})`);
                return await client.messages.create({
                    body: message,
                    to: `+91${customer.mobile}`,
                    from: '+19124831815'
                });
            } catch (error) {
                console.error(`Failed to send message to ${customer.mobile}:`, error);
                return null;
            }
        });

        const results = await Promise.all(sendPromises);
        const successfulSends = results.filter(result => result !== null);

        // Save message to database
        const newMessage = new Message({
            message: message.trim(),
            recipients: uniqueCustomers
        });
        await newMessage.save();

        res.status(200).json({
            success: true,
            message: 'Messages sent successfully',
            totalCustomers: uniqueCustomers.length,
            successfulSends: successfulSends.length,
            failedSends: uniqueCustomers.length - successfulSends.length
        });
    } catch (error) {
        console.error('Message sending error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send messages',
            error: error.message
        });
    }
};

// Get all sent messages
exports.getMessages = async (req, res) => {
    try {
        console.log('Fetching message history...');
        const messages = await Message.find().sort({ createdAt: -1 });
        console.log(`Found ${messages.length} messages`);
        
        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message
        });
    }
};