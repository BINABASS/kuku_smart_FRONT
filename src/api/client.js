import axios from 'axios';
// Note: addNotification is now handled through the NotificationProvider context

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
                    console.error('Access denied');
                    break;
                case 404:
                    // Not found - show error message
                    console.error('Resource not found');
                    break;
                case 500:
                    // Server error - show error message
                    console.error('Server error');
                    break;
                default:
                    // Other errors - show error message
                    console.error(data?.detail || 'An error occurred');
            }
        } else if (error.message === 'Network Error') {
            // Network error - show error message
            console.error('Network error. Please check your connection.');
        }

        return Promise.reject(error);
    }
);

export default api;
