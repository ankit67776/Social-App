import React, { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/login.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { username, password });
      localStorage.setItem('user', JSON.stringify(response.data));
      toast.success('Logged in successfully');
      navigate('/home');
    } catch (error) {
      toast.error("This is wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <h2>Welcome Back</h2>
        </div>
        <div className="login-right">
          <form onSubmit={handleLogin}>
            <h3>Log in</h3>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
            <p>
              Don't have an account? <Link to="/register">Register Here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
