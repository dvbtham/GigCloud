const express = require('express');
const commentController = require('../controllers/api/comments');
const commentValidators = require('../validators/comment');
const router = express.Router();

router.post('/api/reply', commentValidators, commentController.postReply);

module.exports = router;
