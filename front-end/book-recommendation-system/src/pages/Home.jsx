import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/home.css'; // Import CSS file for styling

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login'); // Navigate to the Login page
  };

  const handleSignup = () => {
    navigate('/signup'); // Navigate to the Sign Up page
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to the Book Recommendation System</h1>
        <p>Discover your next favorite book with personalized recommendations!</p>
        <div className="home-buttons">
          <button className="home-button login-button" onClick={handleLogin}>
            Login
          </button>
          <button className="home-button signup-button" onClick={handleSignup}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
