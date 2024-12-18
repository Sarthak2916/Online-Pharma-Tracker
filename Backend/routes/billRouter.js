const express = require('express');
const router = express.Router();
const {addBill,viewBills} = require('../controllers/billController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route for new bill
router.post('/new', addBill);

// Protected route for bill history
router.get('/history', viewBills);

module.exports=router;