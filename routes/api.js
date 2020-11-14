const express = require('express');
const commentController = require('../controllers/api/comments');
const notificationsController = require('../controllers/api/notifications');
const commentValidators = require('../validators/comment');
const router = express.Router();

router.post('/api/reply', commentValidators, commentController.postReply);
router.get('/api/gigs/:gigId/comments/:commentId', commentController.getGigComment);

router.put('/api/gigs/:gigId/comments/:commentId', commentController.putGigComment);

router.get('/api/notifications', notificationsController.getNotifications);

module.exports = router;
