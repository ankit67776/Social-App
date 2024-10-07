import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/register.css';


function RegisterPage() {
  const[name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/register', {name, username, password, email });
      toast.success('Registered successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <form onSubmit={handleRegister}>
          <h3>Register</h3>
          <input type='text' placeholder='Full Name' value={name} onChange={(e) => setName(e.target.value)} required/>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Register</button>
          <p>
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
