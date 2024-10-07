const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
    content : {
        type : String,
        required : true,
    },

    tweetedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },

    likes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    }],

    retweetBy : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ],

    image : {
        type : String,
        default : ''
    },
    
    replies : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Tweet'
        }
    ],

    originalTweet : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Tweet'
    },


}, {timestamps : true});

const Tweet = mongoose.model('Tweet', TweetSchema);
module.exports = Tweet;