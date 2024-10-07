import React from 'react';
import TweetCard from './TweetCard';

const TweetList = ({ tweets, onDelete, onTweetClick }) => {
  return (
    <div className="tweet-list">
      {tweets.map((tweet) => {
        

        return (
          <TweetCard
            key={tweet._id} // Use the unique tweet ID as key
            tweet={tweet}
            onDelete={onDelete}
            onTweetClick={onTweetClick}
          />
        );
      })}
    </div>
  );
};

export default TweetList;
