const express = require('express');
const router = express.Router();
const orgController = require('../controllers/org.controller');

// Route to create an organization and user simultaneously
router.post('/create', orgController.createOrgAndUser);

module.exports = router;
