// src/services/authService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const signup = async (formData) => {
  const res = await axios.post(`${BASE_URL}/signup`, formData);
  return res.data;
};

export const login = async (formData) => {
  const res = await axios.post(`${BASE_URL}/login`, formData);
  return res.data;
};
