const express = require('express');
const router = express.Router();

// Load Controllers
const userController = require('../controllers/users');

// Login User
router.post('/login', userController.loginUser);

module.exports = router;