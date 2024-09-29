const express = require('express');
const router = express.Router();
const orgController = require('../controllers/org.controller');
const authMiddleware = require('../middleware/auth');

// Route to create an organization and user simultaneously
router.post('/create', orgController.createOrgAndUser);
router.post('/saveRecording', orgController.saveRecording);


module.exports = router;
