const express = require('express');
const router = express.Router();
const orgController = require('../controllers/org.controller');

// Route to create an organization and user simultaneously
router.post('/create', orgController.createOrgAndUser);
router.post('/saveGuide', orgController.saveGuide);
router.get('/getGuides', orgController.getGuides);



module.exports = router;
