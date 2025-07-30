import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');

      toast.error('Session expired. Please log in again.');

      setTimeout(() => {
        window.location.href = '/login';
      },20000);
    }
    return Promise.reject(error);
  }
);

export default api;
