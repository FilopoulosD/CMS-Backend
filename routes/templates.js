const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");

const templateController = require('../controllers/templates');
const {roleMiddleware} = require("../middlewares/roleMiddleware");

// Get all templates
router.get('/templates', authMiddleware, roleMiddleware('admin'), templateController.getTemplates);

// Create a new template
router.post('/template/new', authMiddleware, roleMiddleware('admin'), templateController.newTemplate);

// Get a single template by ID
router.get('/template/:id', authMiddleware, roleMiddleware('admin'), templateController.getTemplate);

// Update an existing template
router.put('/template/:id', authMiddleware, roleMiddleware('admin'), templateController.updateTemplate);

// Delete an existing template
router.delete('/template/:id', authMiddleware, roleMiddleware('admin'), templateController.deleteTemplate);

module.exports = router;