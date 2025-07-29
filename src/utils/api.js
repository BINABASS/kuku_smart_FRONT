import axios from 'axios';

// Create API instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Use a more graceful redirect method
      // Note: In a real app, you might want to use a custom event or context
      // to trigger navigation from components instead of directly here
      if (window.location.pathname !== '/login') {
      window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
