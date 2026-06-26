const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const { roleMiddleware } = require("../middlewares/roleMiddleware");

// Load Controllers
const userController = require('../controllers/users');

// Get all users
router.get('/users', authMiddleware, roleMiddleware('admin'), userController.getUsers);

// Create User
router.post('/user/new', userController.newUser);

// Login User
router.post('/login', userController.loginUser);

// Get a single user by ID


// Update an existing user


// Delete an existing user


module.exports = router;