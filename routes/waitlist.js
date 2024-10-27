const express = require('express');
const router = express.Router();
const waitlistController = require('../controllers/waitlist.controller');

// Route to create an organization and user simultaneously
router.post('/waitlist', waitlistController.addtowaitlist);
module.exports = router;
