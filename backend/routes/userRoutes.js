    const express = require('express');
    const { getUser, followUser, unfollowUser, updateUser, getUserTweets, uploadProfilePic} = require('../controllers/userController');
    const authMiddleware = require('../middleware/authMiddleware').authMiddleware;

    const router = express.Router();

    router.get('/:id', authMiddleware, getUser); // Ensure all are valid functions
    router.post('/:id/follow', authMiddleware, followUser);
    router.post('/:id/unfollow', authMiddleware, unfollowUser);
    router.put('/:id', authMiddleware, updateUser);
    router.get('/:id/tweets', authMiddleware, getUserTweets);
    router.post('/:id/uploadProfilePic', authMiddleware, uploadProfilePic);

    module.exports = router;
