const express = require('express');
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

const domainController = require('../controllers/domains');

router.get('/domains', auth.authMiddleware, domainController.getDomains);

router.post('/domains/new', auth.authMiddleware, domainController.newDomain);

router.get('/domain/:id', auth.authMiddleware, domainController.getDomain);

module.exports = router;