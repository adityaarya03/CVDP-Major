// src/utils/auth.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const isLoggedIn = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/profile`, {
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      validateStatus: function (status) {
        return status < 500; // Resolve only if the status code is less than 500
      }
    });
    
    if (res.status === 401) {
      console.log('Not authenticated');
      return false;
    }
    
    return !!res.data;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
};
