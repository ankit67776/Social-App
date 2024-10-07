import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';  
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Sidebar from './components/Sidebar';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TweetDetails from './components/TweetDetails';
import Profilepage from './pages/ProfilePage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <>
      {/* Show Sidebar only on specific routes */}
      {isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/' && <Sidebar />}
      
      <Routes>
        <Route path='/' element = {<Navigate to="/login"/>}/>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path='/tweets/:id' element={<TweetDetails />} />
        <Route path='/profile/:id' element = {<Profilepage/>}/>
      </Routes>
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
