import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

// Fetch all books
export const getBooks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/books`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get book by ID
export const getBookById = async (bookId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/books/${bookId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create new book
export const createBook = async (bookData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/books`, bookData, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a book by ID
export const deleteBook = async (bookId) => {
  try {
    await axios.delete(`${API_BASE_URL}/books/${bookId}`, getAuthHeader());
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update a book by ID
export const updateBook = async (bookId, bookData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/books/${bookId}`, bookData, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
