import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../assets/sidebar.css';




function Sidebar() {
  
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear the user's data from the local storage
    localStorage.removeItem('user');
    //redirect to login page
   navigate('/login'); 
  }
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <FontAwesomeIcon icon={faHome} size="2x" />
        <h2>SocialApp</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/home" className="sidebar-link">
              <FontAwesomeIcon icon={faHome} className="sidebar-icon" />
              Home
            </Link>
          </li>
          <li>
            <Link to = {`/profile/${loggedInUser.user._id}`} className="sidebar-link">
              <FontAwesomeIcon icon={faUser} className="sidebar-icon" />
              Profile
            </Link>
          </li>
          <li>
            <Link to="/logout" className="sidebar-link" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="sidebar-icon" />
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
