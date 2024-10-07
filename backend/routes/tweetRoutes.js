const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware').authMiddleware;
const {createTweet, likeTweet, dislikeTweet, replyTweet, getTweet, getAllTweets, deleteTweet, retweet} = require('../controllers/tweetController');

router.post('/', authMiddleware, createTweet);
router.post('/:id/like', authMiddleware, likeTweet);
router.post('/:id/dislike', authMiddleware, dislikeTweet);
router.post('/:id/reply', authMiddleware, replyTweet);
router.get('/:id', authMiddleware, getTweet);
router.get('/', authMiddleware, getAllTweets);
router.delete('/:id', authMiddleware, deleteTweet);
router.post('/:id/retweet', authMiddleware, retweet);

module.exports = router;