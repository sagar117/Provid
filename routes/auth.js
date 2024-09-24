const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/create-organization', authController.createOrganization); // Add this line for organization creation

module.exports = router;
