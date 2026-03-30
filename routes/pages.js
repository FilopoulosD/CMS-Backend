const express = require('express');
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

const pageController = require('../controllers/pages');

// Get all pages for a specific domain
router.get('/pages/:domainId', auth.authMiddleware, pageController.getPages);

// Create a new page
router.post('/page/new', auth.authMiddleware, pageController.createPage);

// Get a single page by ID
router.get('/page/:id', auth.authMiddleware, pageController.getPage);

// Update an existing page
router.put('/page/:id', auth.authMiddleware, pageController.updatePage);

// Delete an existing page
router.delete('/page/:id', auth.authMiddleware, pageController.deletePage);

module.exports = router;