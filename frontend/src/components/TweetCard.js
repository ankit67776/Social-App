import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faComment, faHeart, faRetweet, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReplyModal from './ReplyModal';
import '../assets/tweetcard.css';
import axios from 'axios';

function TweetCard({ tweet, onDelete, onReply = () => {} }) {
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replies, setReplies] = useState(tweet.replies || []);
  const [likes, setLikes] = useState(tweet.likes || []);
  const [retweetCount, setRetweetCount] = useState(tweet.retweetBy ? tweet.retweetBy.length : 0);
  const [isLiked, setIsLiked] = useState(tweet.likes.some(like => like._id === JSON.parse(localStorage.getItem('user')).user._id));
  const [isRetweeted, setIsRetweeted] = useState(tweet.retweetBy.some(retweet => retweet._id === JSON.parse(localStorage.getItem('user')).user._id));
  const [isProcessing, setIsProcessing] = useState(false);
  const user = tweet.tweetedBy || {};
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const userId = loggedInUser.user._id;

  // Check if the logged-in user is the owner of the tweet
  const isOwner = tweet.tweetedBy && tweet.tweetedBy._id === userId;

  const handleReply = async (replyText, replyImage) => {
    try {
      const formData = new FormData();
      formData.append('content', replyText);
  
      if (replyImage) {
        formData.append('image', replyImage);
      }

      const token = loggedInUser.token;
      if (!token) {
        console.log('Token is missing');
        return;
      }

      const response = await axios.post(
        `https://social-app-ek2z.onrender.com/api/tweet/${tweet._id}/reply`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setReplies([...replies, response.data]);
      onReply(tweet._id, response.data);
    } catch (error) {
      console.error('Error adding reply:', error.response ? error.response.data : error.message);
    }
  };

  const handleLike = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const token = loggedInUser.token;
      if (!token) {
        console.error('Token is missing or User is not authenticated');
        return;
      }

      const endpoint = isLiked
        ? `https://social-app-ek2z.onrender.com/api/tweet/${tweet._id}/dislike`
        : `https://social-app-ek2z.onrender.com/api/tweet/${tweet._id}/like`;

      const response = await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsLiked(!isLiked);
      setLikes(response.data.likes);
    } catch (error) {
      console.error('Error toggling like:', error.response ? error.response.data : error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetweet = async (e) => {
    e.stopPropagation();
    setIsProcessing(true);
    try {
      const token = loggedInUser.token;
      if(!token) {
        console.error('Token is missing');
        return;
      }


      const response = await axios.post(
        `https://social-app-ek2z.onrender.com/api/tweet/${tweet._id}/retweet`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if(isRetweeted) {
        setIsRetweeted(false);
        setRetweetCount(retweetCount - 1);
      }else{
        setIsRetweeted(true);
        setRetweetCount(retweetCount + 1);
      }
    } catch (error) {
      console.error('Error retweeting:', error);
    }
  };

  const baseURL = 'https://social-app-ek2z.onrender.com';
  const imageURL = tweet.image ? `${baseURL}${tweet.image}` : null;

  // Determine if it's a retweet and get the original tweet data
  const originalTweet = tweet.originalTweet || tweet;

  const handleUserClick = () => {
    navigate(`/profile/${user._id}`);
  };

  const handleTweetClick = () => {
    navigate(`/tweets/${tweet._id}`);
  };

  return (
    <div className="tweet-card" onClick={handleTweetClick}>
      {/* Retweet Header */}
      {isRetweeted && (
        <div className="retweet-header">
          Retweeted by {user.username || 'Anonymous'}
        </div>
      )}
      
      <div className="tweet-header">
        <img
          src={`https://social-app-ek2z.onrender.com${originalTweet?.tweetedBy?.profilePicture}` || '/default-avatar.png'}
          alt="User Avatar"
          className="tweet-avatar"
          onClick={handleUserClick}
          style={{ cursor: 'pointer' }}
        />
        <div className="tweet-info">
          <h4 onClick={handleUserClick} style={{ cursor: 'pointer', color: 'blue' }}>
            {originalTweet?.tweetedBy?.username || 'Anonymous'}
          </h4>
          <p>{new Date(originalTweet.createdAt).toLocaleString()}</p>
        </div>
        {isOwner && (
          <FontAwesomeIcon
            icon={faTrashAlt}
            className="tweet-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(tweet._id);  
            }}
          />
        )}
      </div>
      <div className="tweet-content">
        <p>{originalTweet.content}</p>
        {imageURL && <img src={imageURL} alt="Tweet" className="tweet-image" />}
      </div>

      <div className="tweet-actions">
        <span
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          style={{ pointerEvents: isProcessing ? 'none' : 'auto' }}
        >
          <FontAwesomeIcon
            icon={faHeart}
            className="tweet-icon"
            style={{ color: isLiked ? 'red' : 'gray' }}
          />
          {likes.length}
        </span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            setShowReplyModal(true);
          }}
        >
          <FontAwesomeIcon icon={faComment} className="tweet-icon" />
          {replies.length}
        </span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            handleRetweet(e);
          }}
        >
          <FontAwesomeIcon icon={faRetweet} className="tweet-icon" />
          {retweetCount}
        </span>
      </div>

      <ReplyModal
        show={showReplyModal}
        handleClose={() => setShowReplyModal(false)}
        handleReply={handleReply}
      />
    </div>
  );
}

export default TweetCard;
