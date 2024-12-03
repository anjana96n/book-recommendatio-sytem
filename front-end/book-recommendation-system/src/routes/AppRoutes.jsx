import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../features/Auth/Login';
import Signup from '../features/Auth/Signup';
import BookList from '../features/Books/BookList';
import PrivateRoute from './PrivateRoute'; // Import PrivateRoute
import Feed from '../features/Feed/Feed';
import CreateBook from '../features/Books/CreateBook';
import BookDetail from '../features/Books/BookDetail';
import EditBook from '../features/Books/EditBook';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/books" element={<PrivateRoute element={<BookList />} />} />
      <Route path="/home" element={<PrivateRoute element={<Feed />} />} />
      <Route path="/create-book" element={<PrivateRoute element={<CreateBook />} />} />
      <Route path="/books/:bookId" element={<PrivateRoute element={<BookDetail />} />} />
      <Route path="/edit-book/:bookId" element={<PrivateRoute element={<EditBook />} />} />
    </Routes>
  );
};

export default AppRoutes;
