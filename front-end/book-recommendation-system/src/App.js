import React, { useContext } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import { AuthContext } from './context/AuthContext'; // Import AuthContext
import './assets/styles/global.css';

const App = () => {
  const { isLoggedIn } = useContext(AuthContext); // Access isLoggedIn from context

  return (
    <div className="wrapper">
      {isLoggedIn && <Header />} {/* Show Header if logged in */}
      <div className="content">
        <AppRoutes />
      </div>
      {isLoggedIn && <Footer />} {/* Show Footer if logged in */}
    </div>
  );
};

export default App;
