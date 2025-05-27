import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const authAPI = {
  login: async (data: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
  },
  register: async (data: { name: string; email: string; password: string; role?: string }) => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  }
}; 