const Tweet = require("../models/Tweet");
const multer = require('multer');
const path = require('path');

//configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

exports.createTweet = [
    upload.single('image'), // 'image' is the key for the file in the form data
    async (req, res) => {
        try {
            const userId = req.user.id;

            // Validate that 'content' is included in the request body
            const { content } = req.body;
            if (!content) {
                return res.status(400).json({ error: 'Content is required' });
            }

            // Create a new tweet with the provided content and the logged-in user's ID as 'tweetedby'
            const tweet = new Tweet({
                content,
                tweetedBy: userId,
            });

            // Handle image upload if present
            if (req.file) {
                // You can save the file to a location or store the file data
                const filepath = `/uploads/${req.file.filename}`;
                tweet.image = filepath; // Assuming you're saving the file and using its path
            }

            await tweet.save();  // Save the tweet to the database
            await tweet.populate('tweetedBy', 'username profilePicture');  // Populate tweetedBy to include user details
            res.status(201).json({ message: 'Tweet created successfully', tweet });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
];


exports.likeTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        const userId = req.user.id;
        const tweetId = req.params.id;

        if (!userId || !tweetId) {
            return res.status(400).json({ message: 'Invalid Tweet or User Id' });
        }
        if (!tweet) {
            return res.status(400).json({ error: 'Tweet not found' });
        }
        if (tweet.likes.includes(userId)) {
            return res.status(400).json({ error: 'Tweet already Liked' });
        }

        tweet.likes.push(userId);
        await tweet.save();
        res.status(200).json({ likes: tweet.likes });
    } catch (error) {
        console.error('Error in LikeTweet: ', error);
        return res.status(400).json({ error: error.message });

    }
};

exports.dislikeTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        const userId = req.user.id;

        if (!tweet) {
            return res.status(400).json({ error: 'Tweet not found' });
        }

        // Check if the user has liked the tweet
        if (!tweet.likes.includes(userId)) {
            return res.status(400).json({ error: 'Tweet not liked' });
        }

        // Remove the user ID from the likes array
        tweet.likes = tweet.likes.filter(id => !id.equals(userId));
        await tweet.save();
        res.json({ likes: tweet.likes });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.replyTweet = [
    upload.single('image'), // Handle image upload
    async (req, res) => {
        const { content } = req.body;
        console.log('Content:', content); // Debug log to ensure content is received

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        try {
            const parentTweet = await Tweet.findById(req.params.id);
            if (!parentTweet) {
                return res.status(400).json({ error: 'Parent Tweet not found' });
            }

            const replyTweet = new Tweet({
                content,
                tweetedBy: req.user.id,
                replies: []
            });

            // Handle image upload if present
            if (req.file) {
                // Save the file path and associate it with the tweet
                const filepath = `/uploads/${req.file.filename}`;
                replyTweet.image = filepath;
            }

            await replyTweet.save();
            parentTweet.replies.push(replyTweet._id);
            await parentTweet.save();

            res.status(201).json(replyTweet);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
];



exports.getTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id)
            .populate('tweetedBy', 'username profilePicture') // Populate the tweetedBy field
            .populate({
                path: 'originalTweet',
                populate: {
                    path: 'tweetedBy',
                    select: 'username profilePicture', // Populate the tweetedBy of the original tweet
                },
            })
            .populate('likes', 'username profilePicture') // Optionally populate likes if it's an array of User references
            .populate('retweetBy', 'username profilePicture') // Populate retweetBy to show users who retweeted
            .populate({
                path: 'replies',
                populate: {
                    path: 'tweetedBy',
                    select: 'username profilePicture',
                },
            });

        if (!tweet) {
            return res.status(404).json({ error: 'Tweet not found' });
        }
        res.json(tweet);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


exports.getAllTweets = async (req, res) => {
    try {
        const tweets = await Tweet.find()
            .populate('tweetedBy', 'username profilePicture')
            .populate({
                path: 'originalTweet',
                populate: {
                    path: 'tweetedBy',
                    select: 'username profilePicture',
                },
            })
            .populate('likes', 'username profilePicture')
            .populate('retweetBy', 'username profilePicture')
            .populate({
                path: 'replies',
                populate: {
                    path: 'tweetedBy',
                    select: 'username profilePicture',
                },
            })
            .sort({ createdAt: -1 });

        res.json(tweets);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.deleteTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet) {
            return res.status(400).json({ error: 'Tweet not found' });
        }
        if (!tweet.tweetedBy.equals(req.user.id)) {
            return res.status(400).json({ error: 'Unauthorized' });
        }

        await Tweet.deleteOne({_id : req.params.id});
        res.json({ message: 'Tweet deleted' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.retweet = async (req, res) => {
    try {
        const { id } = req.params;
        const originalTweet = await Tweet.findById(id);

        if (!originalTweet) {
            return res.status(400).json({ error: 'Original Tweet not found' });
        }

        // check if the user has already retweeted the tweet
        const retweetIndex = originalTweet.retweetBy.indexOf(req.user.id);

        if (retweetIndex !== -1) {
            // user has already retweeted, remove retweet
            originalTweet.retweetBy.splice(retweetIndex, 1);
            await originalTweet.save();


            // optionally: find and delete the retweet from the user's tweets;
            await Tweet.deleteOne({ originalTweet: originalTweet._id, tweetedBy: req.user.id });

            return res.status(200).json({ message: 'Retweet Removed', retweetBy: originalTweet.retweetBy });
        } else {
            // create a new retweet
            const retweet = new Tweet({
                content: originalTweet.content,
                tweetedBy: req.user.id,
                originalTweet: originalTweet._id,
            });

            await retweet.save();
            originalTweet.retweetBy.push(req.user.id);
            await originalTweet.save();

            res.status(200).json({ message: 'Retweet added', retweetBy: originalTweet.retweetBy });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};
