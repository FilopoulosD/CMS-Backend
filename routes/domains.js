const express = require('express');
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

const domainController = require('../controllers/domains');

// Get all domains
router.get('/domains', auth.authMiddleware, domainController.getDomains);

// Create a new domain
router.post('/domain/new', auth.authMiddleware, domainController.newDomain);

// Get a single domain by ID
router.get('/domain/:id', auth.authMiddleware, domainController.getDomain);

// Update an existing domain
router.put('/domain/:id', auth.authMiddleware, domainController.updateDomain);

// Delete an existing domain
router.delete('/domain/:id', auth.authMiddleware, domainController.deleteDomain);

module.exports = router;