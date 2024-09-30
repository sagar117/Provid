const express = require('express');
const router = express.Router();
const orgController = require('../controllers/org.controller');

// Route to create an organization and user simultaneously
router.post('/create', orgController.createOrgAndUser);
router.post('/saveGuide', orgController.saveGuide);
router.get('/getGuides', orgController.getGuides);
router.get('/getGuides/:organization', orgController.getorgguides);
// router.put('/guides/:guideId',orgController.updateguide);
// router.delete('/:guideId',orgController.deleteguide);
// router.put('/guides/:guideId/status',orgController.updateguidestaus);

router.get('/organization/:name', orgController.getOrgdetails);




module.exports = router;
