import React, { useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../assets/styles/global.css'; // Optional for specific header styling

const Header = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo">
        <NavLink to="/feed">BookRec</NavLink>
      </div>
      <nav className="nav-links">
        <NavLink to="/feed" activeClassName="active-link">Home</NavLink>
        <NavLink to="/books" activeClassName="active-link">Books</NavLink>
        {/* Add other navigation links as needed */}
      </nav>
      <div className="logout">
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </header>
  );
};

export default Header;
