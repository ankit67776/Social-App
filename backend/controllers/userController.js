const multer = require("multer");
const Tweet = require("../models/Tweet");
const User = require("../models/User");
const path = require("path");

exports.getUser = async(req, res) => {
    try{
        const user = await User.findById(req.params.id).populate('followers following');
        if(!user) {
            return res.status(404).json({error : 'user not found'});
        }
        res.json(user);
    }catch(error) {
        res.status(400).json({error : error.message});
    }
};

exports.followUser = async(req, res) => {
    try{
        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user.id);

        if(!userToFollow || !loggedInUser) {
            return res.status(404).json({error : 'user not found'});
        }
        if(userToFollow._id.equals(loggedInUser._id)) {
            return res.status(400).json({error : 'you cannot follow yourself'});
        }
        if(loggedInUser.following.includes(userToFollow._id)) {
            return res.status(400).json({error : 'Already following the user'});
        }
        loggedInUser.following.push(userToFollow._id);
        userToFollow.followers.push(loggedInUser._id);
        await loggedInUser.save();
        await userToFollow.save();
        res.json({message : 'user followed'});
    }catch(error) {
        return res.status(400).json({error : error.message});
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user.id);

        if (!userToUnfollow || !loggedInUser) {
            return res.status(404).json({ error: 'user not found' });
        }

        if (!loggedInUser.following.includes(userToUnfollow._id)) {
            return res.status(400).json({ error: 'not following the user' });
        }

        loggedInUser.following = loggedInUser.following.filter(
            user => !user.equals(userToUnfollow._id)
        );

        userToUnfollow.followers = userToUnfollow.followers.filter(
            user => !user.equals(loggedInUser._id)
        );

        await loggedInUser.save();
        await userToUnfollow.save();
        res.json({ message: 'user unfollowed' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


exports.updateUser = async(req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({error : 'user not found'});
        }
        if(!user._id.equals(req.user.id)) {
            return res.status(400).json({error : "unauthorized"});
        }
        const updates = {name, dob, location} = req.body;
        Object.assign(user, updates);
        await user.save();
        res.json(user);
    }catch(error) {
        return res.json({error : error.message});
    }
};

exports.getUserTweets = async (req, res) => {
    try {
      const userId = await User.findById(req.params.id);
  
      // Fetch tweets where tweetedBy is the user Id and populate the tweetedBy field
      const tweets = await Tweet.find({ tweetedBy: userId })
        .sort({ createdAt: -1 })
        .populate('tweetedBy', 'username profilePicture'); // Populate tweetedBy with username and avatar fields
  
      res.status(200).json(tweets);
    } catch (error) {
      console.error('Error fetching User tweets:', error);
      res.status(500).json({ message: 'Failed to fetch user tweets' });
    }
  };
  
  // configure multer for file upload
  const storage = multer.diskStorage({
    destination : (req, res, cb) => {
        cb(null, 'uploads/profile-pics/');   // directory for profile pictures
    },

    filename : (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({ 
    storage, 
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/; // Accept only these formats
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});


exports.uploadProfilePic = [
    upload.single('profilePic'), // Handle image upload
    async (req, res) => {
        try {
            const userId = req.user.id; // Assuming req.user.id is populated by authMiddleware
            const filepath = `/uploads/profile-pics/${req.file.filename}`;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Update the user's profile picture
            user.profilePicture = filepath;
            await user.save();

            res.status(200).json({ 
                message: 'Profile picture uploaded successfully', 
                profilePicture: filepath 
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
];



