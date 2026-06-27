const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");

const templateController = require('../controllers/templates');
const { roleMiddleware } = require("../middlewares/roleMiddleware");

// Get all templates
router.get('/templates', authMiddleware, roleMiddleware('admin', 'editor'), templateController.getTemplates);

// Get a single template
router.get('/templates/:id', authMiddleware, roleMiddleware('admin', 'editor'), templateController.getTemplate);

module.exports = router;