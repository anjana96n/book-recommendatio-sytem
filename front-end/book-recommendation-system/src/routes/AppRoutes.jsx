import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../features/Auth/Login';
import Signup from '../features/Auth/Signup';
import BookList from '../features/Books/BookList';
import PrivateRoute from './PrivateRoute'; // Import PrivateRoute
import Feed from '../features/Feed/Feed';
import CreateBook from '../features/Books/CreateBook';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/books" element={<PrivateRoute element={<BookList />} />} />
      <Route path="/home" element={<PrivateRoute element={<Feed />} />} />
      <Route path="/create-book" element={<PrivateRoute element={<CreateBook />} />} />
    </Routes>
  );
};

export default AppRoutes;
