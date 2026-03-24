const express = require('express');
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

const templateController = require('../controllers/templates');

router.get('/templates', auth.authMiddleware, templateController.getTemplates);

router.post('/templates/new', auth.authMiddleware, templateController.newTemplate);

router.get('/templates/:id', auth.authMiddleware, templateController.getTemplate);

module.exports = router;