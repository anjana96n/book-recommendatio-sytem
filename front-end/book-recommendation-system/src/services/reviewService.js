import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

export const createReview = async (reviewData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/reviews`,
      reviewData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getBookReviews = async (bookId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/reviews/${bookId}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 