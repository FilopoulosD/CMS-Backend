const express = require('express');
const router = express.Router();
const domainController = require('../controllers/domains');
const userController = require('../controllers/users');
const templateController = require('../controllers/templates');
const { authMiddleware } = require("../middlewares/authMiddleware");
const { roleMiddleware } = require("../middlewares/roleMiddleware");
const { umbrellaOnlyMiddleware } = require("../middlewares/umbrellaMiddlewares");

router.use(authMiddleware);
router.use(roleMiddleware('admin'));
router.use(umbrellaOnlyMiddleware);

/*
Domains
*/

// Get all domains ✅
router.get('/domains', domainController.getDomains);

// Create a new domain ✅
router.post('/domains/new', domainController.newDomain);

// Get a single domain by ID ✅
router.get('/domains/:id', domainController.getDomain);

// Update an existing domain ✅
router.put('/domains/:id', domainController.updateDomain);

// Delete an existing domain  ✅
router.delete('/domains/:id', domainController.deleteDomain);

/*
Users 
*/

// Get all users ✅
router.get('/users', userController.getUsers);

// Create User  ✅
router.post('/users/new', userController.newUser);

// Update an existing user

// Delete an existing user

/*
Templates 
*/

// Update an existing template ✅
router.put('/templates/:id', templateController.updateTemplate);

// Delete an existing template ✅
router.delete('/templates/:id', templateController.deleteTemplate);

// Create a new template ✅
router.post('/templates/new', templateController.newTemplate);


module.exports = router;