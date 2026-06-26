const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");

const domainController = require('../controllers/domains');
const {roleMiddleware} = require("../middlewares/roleMiddleware");

// Get all domains
router.get('/domains', authMiddleware, roleMiddleware('admin'), domainController.getDomains);

// Create a new domain
router.post('/domain/new', authMiddleware, roleMiddleware('admin'), domainController.newDomain);

// Get a single domain by ID
router.get('/domain/:id', authMiddleware, roleMiddleware('admin'), domainController.getDomain);

// Update an existing domain
router.put('/domain/:id', authMiddleware, roleMiddleware('admin'), domainController.updateDomain);

// Delete an existing domain
router.delete('/domain/:id', authMiddleware, roleMiddleware('admin'), domainController.deleteDomain);

module.exports = router;