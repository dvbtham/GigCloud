const express = require('express');
const gigsController = require('../controllers/gigs');
const homeController = require('../controllers/home');
const commentController = require('../controllers/comments');
const gigValidators = require('../validators/gig');
const commentValidators = require('../validators/comment');
const router = express.Router();

router.get('/', homeController.getUpcommingGigs);
router.get('/add-a-gig', gigsController.getAddGig);
router.post('/add-a-gig', gigValidators, gigsController.postAddGig);
router.post('/going-a-gig', homeController.postGoingGig);
router.post('/follow-gig', homeController.postFollowGig);
router.get('/gigs/:slug', gigsController.getGigDetail);
router.post('/add-comment', commentValidators, commentController.postAddComment);

module.exports = router;
