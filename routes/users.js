const express = require('express');
const User = require("../models/Users");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

// Load Controllers
const userController = require('../controllers/users');

// Get all users
router.get('/users', auth.authMiddleware, userController.getUsers);

// Create User
router.post('/users', userController.newUser);

router.post('/login', userController.loginUser);

module.exports = router;