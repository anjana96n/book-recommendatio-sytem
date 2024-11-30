import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Login API
export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
  return response.data; // Return the token or response data
};


