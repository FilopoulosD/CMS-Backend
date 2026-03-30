const express = require('express');
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

const templateController = require('../controllers/templates');

// Get all templates
router.get('/templates', auth.authMiddleware, templateController.getTemplates);

// Create a new template
router.post('/template/new', auth.authMiddleware, templateController.newTemplate);

// Get a single template by ID
router.get('/template/:id', auth.authMiddleware, templateController.getTemplate);

// Update an existing template
router.put('/template/:id', auth.authMiddleware, templateController.updateTemplate);

// Delete an existing template
router.delete('/template/:id', auth.authMiddleware, templateController.deleteTemplate);

module.exports = router;