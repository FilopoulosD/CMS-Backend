const express = require('express');
const router = express.Router();
const{ authMiddleware } = require("../middlewares/authMiddleware");

const pageController = require('../controllers/pages');
const {roleMiddleware} = require("../middlewares/roleMiddleware");

// Get all pages for a specific domain
router.get('/pages/:domainId', authMiddleware, roleMiddleware('admin', 'editor'), pageController.getPages);

// Create a new page
router.post('/page/new', authMiddleware, roleMiddleware('admin', 'editor'), pageController.createPage);

// Get a single page by ID
router.get('/page/:id', authMiddleware, roleMiddleware('admin', 'editor'), pageController.getPage);

// Update an existing page
router.put('/page/:id', authMiddleware, roleMiddleware('admin', 'editor'), pageController.updatePage);

// Delete an existing page
router.delete('/page/:id', authMiddleware, roleMiddleware('admin', 'editor'), pageController.deletePage);

module.exports = router;