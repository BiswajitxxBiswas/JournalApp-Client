import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('userToken');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },
};

// Journal Entry APIs
export const journalAPI = {
  getAllEntries: async () => {
    const response = await api.get('/journal-entries');
    return response.data;
  },

  getEntry: async (id) => {
    const response = await api.get(`/journal-entries/${id}`);
    return response.data;
  },

  createEntry: async (entry) => {
    const response = await api.post('/journal-entries', entry);
    return response.data;
  },

  updateEntry: async (id, entry) => {
    const response = await api.put(`/journal-entries/${id}`, entry);
    return response.data;
  },

  deleteEntry: async (id) => {
    await api.delete(`/journal-entries/${id}`);
  },
};

// User Profile APIs
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  getEmotionalStatus: async () => {
    const response = await api.get('/users/emotional-status');
    return response.data;
  },

  updateEmotionalStatus: async (status) => {
    const response = await api.put('/users/emotional-status', { status });
    return response.data;
  },
};

export default api;
