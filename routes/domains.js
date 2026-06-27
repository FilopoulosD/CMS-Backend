const express = require('express');
const router = express.Router();
const domainController = require('../controllers/domains');
const { authMiddleware } = require("../middlewares/authMiddleware");
const { roleMiddleware } = require("../middlewares/roleMiddleware");





module.exports = router;