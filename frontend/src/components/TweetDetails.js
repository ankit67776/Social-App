import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TweetCard from './TweetCard';
import '../assets/tweetdetails.css';

function TweetDetails() {
    const { id: tweetId } = useParams(); // Extract tweet ID from URL
    const [tweet, setTweet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const token = loggedInUser ? loggedInUser.token : null;
    console.log("Tweet ID from URL:", tweetId);
    useEffect(() => {
        if (!tweetId || !token) {
            setError('Tweet not found or unauthorized.');
            setLoading(false);
            return;
        }

        const fetchTweet = async () => {
            try {
                const response = await axios.get(`https://social-app-ek2z.onrender.com/api/tweet/${tweetId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('fetched tweet data', response.data);
                setTweet(response.data);
            } catch (err) {
                console.error('Error fetching tweet details:', err);
                setError('Failed to load tweet details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchTweet();
    }, [tweetId, token]);

    if (loading) return <p>Loading tweet details...</p>;
    if (error) return <p>{error}</p>;

    const replies = tweet?.replies || [];

    return (
        <div className="tweet-details">
            <button onClick={() => navigate(-1)}>Back</button>
            {tweet ? (
                <>
                    <TweetCard tweet={tweet} />
                    <div className="replies">
                        {replies.length > 0 ? (
                            replies.map((reply, index) => (
                                <TweetCard key={reply._id || index} tweet={reply} />
                            ))
                        ) : (
                            <p>No replies yet.</p>
                        )}
                    </div>
                </>
            ) : (
                <p>Tweet not found.</p>
            )}
        </div>
    );
}

export default TweetDetails;
