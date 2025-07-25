import axios from 'axios';
import { addNotification } from '../components/Notification';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;
        
        if (response) {
            // Server responded with a status code that falls out of the range of 2xx
            const { status, data } = response;
            
            switch (status) {
                case 401:
                    // Unauthorized - redirect to login
                    window.location.href = '/login';
                    break;
                case 403:
                    // Forbidden - show error message
                    addNotification('Access denied', 'error');
                    break;
                case 404:
                    // Not found - show error message
                    addNotification('Resource not found', 'error');
                    break;
                case 500:
                    // Server error - show error message
                    addNotification('Server error', 'error');
                    break;
                default:
                    // Other errors - show error message
                    addNotification(data?.detail || 'An error occurred', 'error');
            }
        } else if (error.message === 'Network Error') {
            // Network error - show error message
            addNotification('Network error. Please check your connection.', 'error');
        }

        return Promise.reject(error);
    }
);

export default api;
