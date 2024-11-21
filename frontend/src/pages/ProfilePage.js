import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import EditProfileModal from '../components/EditProfileModal';
import TweetCard from '../components/TweetCard';
import ProfilePictureModal from '../components/ProfilePictureModal'; // Import the new component
import '../assets/profile.css';

function ProfilePage() {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false); // State for profile picture modal
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const userId = loggedInUser?.user._id;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    if (!loggedInUser || !loggedInUser.token) {
      toast.error('User not authenticated. Please log in.');
      navigate('/login');
      return;
    }

    try {
      const profileResponse = await axios.get(`https://social-app-ek2z.onrender.com/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      const tweetResponse = await axios.get(`https://social-app-ek2z.onrender.com/api/user/${id}/tweets`, {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      const profileData = profileResponse.data;
      setUserProfile(profileData);
      setTweets(tweetResponse.data || []);
      setIsCurrentUser(userId === id);
      setIsFollowing(profileData.followers.some((follower) => follower._id === userId));
      setFollowersCount(profileData.followers.length);
    } catch (error) {
      console.error('Error fetching profile data', error);
      toast.error('Failed to fetch profile data');
    }
  };

  const handleFollowToggle = async () => {
    try {
      const endpoint = isFollowing
        ? `https://social-app-ek2z.onrender.com/api/user/${id}/unfollow`
        : `https://social-app-ek2z.onrender.com/api/user/${id}/follow`;

      setIsFollowing(!isFollowing);
      setFollowersCount((prevCount) => (isFollowing ? prevCount - 1 : prevCount + 1));

      await axios.post(endpoint, {}, {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
    } catch (error) {
      console.error('Error toggling follow status:', error);
      toast.error('Failed to toggle follow status');
    }
  };

  const handleDelete = async (tweetId) => {
    try {
      await axios.delete(`https://social-app-ek2z.onrender.com/api/tweet/${tweetId}`, {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      setTweets(tweets.filter((tweet) => tweet._id !== tweetId));
      toast.success('Tweet deleted successfully');
    } catch (error) {
      toast.error('Failed to delete tweet');
    }
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveProfile = async (updatedProfile) => {
    try {
      const response = await axios.put(`https://social-app-ek2z.onrender.com/api/user/${id}`, updatedProfile, {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      setUserProfile(response.data);
      setShowEditModal(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  // Open profile picture modal
  const handleOpenProfilePictureModal = () => {
    setShowProfilePictureModal(true);
  };

  // Close profile picture modal
  const handleCloseProfilePictureModal = () => {
    setShowProfilePictureModal(false);
  };



  return (
    <div className="profile-page">
      <Sidebar user={loggedInUser} />
      <div className="profile-content">
        {userProfile ? (
          <div className="profile-header">
            <div className="cover-photo"></div>
            <img
              src={userProfile.profilePicture ? `https://social-app-ek2z.onrender.com${userProfile?.profilePicture}` : '/default-avatar.png'}
              alt="Profile Avatar"
              className="profile-avatar"
              onClick={handleOpenProfilePictureModal} // Open modal on click
            />
            <div className="profile-details">
              <h2>{userProfile?.name}</h2>
              <p className="username">@{userProfile?.username}</p>
              <p className="details">{userProfile.bio || 'No bio available'}</p>
              <p>Location: {userProfile.location || 'Not specified'}</p>
              <p>Member since: {new Date(userProfile.createdAt).toLocaleDateString()}</p>
              <p>Followers: {followersCount}</p>
              <p>Following: {userProfile.following.length}</p>

              {isCurrentUser ? (
                <>
                  <button className="edit-profile-btn" onClick={handleEditProfile}>
                    Edit Profile
                  </button>

                  <button className='profile-picutre-btn' onClick={handleOpenProfilePictureModal}>
                    Upload Profile Picture
                  </button>

                </>

              ) : (
                <button
                  className={`follow-btn ${isFollowing ? 'following' : ''}`}
                  onClick={handleFollowToggle}
                  style={{
                    backgroundColor: isFollowing ? 'grey' : '#1da1f2',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}

                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}

        <div className="tweets-section">
          <h3>Tweets</h3>
          {Array.isArray(tweets) && tweets.length > 0 ? (
            tweets.map((tweet) => (
              <TweetCard
                key={tweet._id}
                tweet={tweet}
                userId={userId}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p>No tweets yet</p>
          )}
        </div>
      </div>

      {/* Profile Picture Modal */}
      <ProfilePictureModal
        show={showProfilePictureModal}
        handleClose={handleCloseProfilePictureModal}
        userId={userId}
        loggedInUser={loggedInUser}
        setUserProfile={setUserProfile} // Pass the setUserProfile function to update the picture
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        show={showEditModal}
        handleClose={handleCloseEditModal}
        userProfile={userProfile}
        handleSave={handleSaveProfile}
      />
    </div>
  );
}

export default ProfilePage;
