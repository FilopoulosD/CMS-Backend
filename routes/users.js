const express = require('express');
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

// Load Controllers
const userController = require('../controllers/users');

// Get all users
router.get('/users', auth.authMiddleware, userController.getUsers);

// Create User
router.post('/user/new', userController.newUser);

// Login User
router.post('/login', userController.loginUser);

// Get a single user by ID


// Update an existing user


// Delete an existing user


module.exports = router;