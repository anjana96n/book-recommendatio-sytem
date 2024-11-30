import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Fetch all books
export const getBooks = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/books`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
