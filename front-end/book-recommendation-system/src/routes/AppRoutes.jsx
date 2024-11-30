import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../features/Auth/Login';
import Signup from '../features/Auth/Signup';
import BookList from '../features/Books/BookList';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/books" element={<BookList />} />
    </Routes>
  );
};

export default AppRoutes;
