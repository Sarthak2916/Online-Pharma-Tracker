const express = require('express');
const router=express.Router();

const {loginUser} = require('../controllers/user.loginController')
router.post('/',loginUser);
module.exports = router;