import React, { useEffect, useState, useCallback } from 'react';
import '../assets/home.css';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import TweetList from '../components/TweetList';
import NewTweetModel from '../components/NewTweetModel';
import TweetDetails from '../components/TweetDetails';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [tweets, setTweets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTweet, setSelectedTweet] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTweets = useCallback(async () => {
    setLoading(true);
    const loggedInUser = JSON.parse(localStorage.getItem('user'));

    console.log(loggedInUser.token);
    if (!loggedInUser) {
      navigate('/login');
      return;
    }
    try { 
      const response = await axios.get('http://localhost:3000/api/tweet', {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });
      console.log(response.data);
      setTweets(response.data);
      
    } catch (error) {
      toast.error('Failed to fetch tweets');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

  const handleTweet = async (tweetContent, tweetImage) => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
  
    const formData = new FormData();
    formData.append('content', tweetContent);
    console.log('FormData:', formData.get('content'));
    if (tweetImage) formData.append('image', tweetImage);
  
    try {
      const response = await axios.post('http://localhost:3000/api/tweet', formData, {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const newTweet = response.data.tweet; // Correctly access the tweet from the response
      setTweets([newTweet, ...tweets]); // Add the new tweet to the beginning of the list
      toast.success('Tweet posted successfully');
    } catch (error) {
      toast.error('Failed to post tweet');
    }
  };
  

  const handleDelete = async (tweetId) => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));

    try {
      await axios.delete(`http://localhost:3000/api/tweet/${tweetId}`, {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });
      setTweets(tweets.filter((tweet) => tweet._id !== tweetId)); // Use '_id' here
      toast.info('Tweet deleted successfully');
    } catch (error) {
      toast.error('Failed to delete tweet');
    }
  };

  const handleTweetClick = (tweet) => {
    setSelectedTweet(tweet);
  };

  const handleCloseTweetDetails = () => {
    setSelectedTweet(null);
  };

  return (
    <div className="home-container">
      <Sidebar user={JSON.parse(localStorage.getItem('user'))} />
      <div className="tweet-list-container">
        <h2>Home</h2>
        <button className="tweet-button" onClick={() => setShowModal(true)}>
          Tweet
        </button>
        {loading ? (
          <p>Loading...</p>
        ) : selectedTweet ? (
          <TweetDetails tweet={selectedTweet} onClose={handleCloseTweetDetails} />
        ) : (
          <TweetList tweets={tweets} onDelete={handleDelete} onTweetClick={(tweet) => navigate(`/tweets/${tweet._id}`)} />
        )}
      </div>
      <NewTweetModel
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleTweet={handleTweet}
      />
    </div>
  );
}

export default HomePage;
