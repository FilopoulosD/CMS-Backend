const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pages');
const { authMiddleware } = require("../middlewares/authMiddleware");
const { roleMiddleware } = require("../middlewares/roleMiddleware");
const { domainMiddleware } = require("../middlewares/domainMiddleware");
const { nonUmbrellaMiddleware } = require("../middlewares/umbrellaMiddlewares");

router.use(authMiddleware);
router.use(roleMiddleware('admin', 'editor', 'user'));
router.use(domainMiddleware);
router.use(nonUmbrellaMiddleware);

// Get all pages for a specific domain
router.get('/pages', pageController.getPages);

// Create a new page (works only for non umbrella domains)
router.post('/page/new', pageController.createPage);

// Get a single page by ID
router.get('/page/:id', pageController.getPage);

// Update an existing page
router.put('/page/:id', pageController.updatePage);

// Delete an existing page
router.delete('/page/:id', pageController.deletePage);


module.exports = router;