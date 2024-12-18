const express = require('express');
const router = express.Router();
const {addMed, deleteMed, updateMed, updateMedQty} = require('../controllers/inventoryController');
const {view} = require('../controllers/viewEntries.controller');
const authMiddleware = require('../middleware/authMiddleware');

// Public route
router.get('/view', view);

// Protected routes
router.post('/add', addMed);
router.delete('/delete', authMiddleware, deleteMed);
router.put('/update', authMiddleware, updateMed);
router.patch('/updateqty', authMiddleware, updateMedQty);
module.exports = router;