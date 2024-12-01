import React from 'react';
import '../assets/styles/global.css'; // Optional for specific footer styling

const Footer = () => {
  return (
    <footer className="footer" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
    }}>
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Book Recommendation System</p>
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
