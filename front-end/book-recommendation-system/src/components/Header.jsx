import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const Header = () => {
  const { logout } = useContext(AuthContext); // Use logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear authentication state
    navigate('/login'); // Redirect to login
  };

  return (
    <header>
      <button onClick={handleLogout}>Logout</button>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/books">Books</a></li>
          {/* Add other links as necessary */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
