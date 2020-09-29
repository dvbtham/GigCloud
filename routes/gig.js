const express = require('express');
const gigsController = require('../controllers/gigs');
const gigValidators = require('../validators/gig');
const router = express.Router();

router.get('/add-a-gig', gigsController.getAddGig);
router.post('/add-a-gig', gigValidators, gigsController.postAddGig);

module.exports = router;
