import React, { useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../assets/styles/global.css';

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
        <NavLink to="/">BookRec</NavLink>
      </div>
      <nav className="nav-links">
        {/* <NavLink to="/" activeClassName="active-link">Home</NavLink> */}
        <NavLink to="/books" activeClassName="active-link">Books</NavLink>
      </nav>
      <div className="logout">
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </header>
  );
};

export default Header;
