// Debug API utility for testing authentication and API calls
import api from '../api/client';

const debugApi = {
    // Test authentication token
    testAuth: async () => {
        const token = localStorage.getItem('token');
        console.log('🔍 Current token:', token);
        
        if (!token) {
            console.error('❌ No token found in localStorage');
            return false;
        }
        
        // Test with direct axios call
        try {
            const axios = require('axios');
            const response = await axios.get('http://localhost:8000/api/users/', {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ Direct axios authentication successful:', response.data);
        } catch (error) {
            console.error('❌ Direct axios authentication failed:', error.response?.status, error.response?.data);
        }
        
        try {
            const response = await api.get('/users/');
            console.log('✅ API client authentication successful:', response.data);
            return true;
        } catch (error) {
            console.error('❌ API client authentication failed:', error.response?.status, error.response?.data);
            return false;
        }
    },

    // Test farmers API
    testFarmers: async () => {
        try {
            console.log('🔍 Testing farmers API...');
            const response = await api.get('/farmers/');
            console.log('✅ Farmers API successful:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Farmers API failed:', error.response?.status, error.response?.data);
            return null;
        }
    },

    // Test creating a farmer
    testCreateFarmer: async () => {
        const testFarmer = {
            first_name: 'Test',
            last_name: 'Farmer',
            phone: '1234567890',
            email: 'testfarmer@example.com',
            address: 'Test Address',
            status: true
        };
        
        try {
            console.log('🔍 Testing farmer creation...');
            const response = await api.post('/farmers/', testFarmer);
            console.log('✅ Farmer creation successful:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Farmer creation failed:', error.response?.status, error.response?.data);
            return null;
        }
    },

    // Test all APIs
    runAllTests: async () => {
        console.log('🚀 Starting API tests...');
        
        const authResult = await debugApi.testAuth();
        if (!authResult) {
            console.error('❌ Authentication failed, stopping tests');
            return;
        }
        
        await debugApi.testFarmers();
        await debugApi.testCreateFarmer();
        
        console.log('✅ All tests completed');
    },

    // Check localStorage
    checkLocalStorage: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        console.log('🔍 LocalStorage check:');
        console.log('Token:', token ? 'Present' : 'Missing');
        console.log('User:', user ? 'Present' : 'Missing');
        
        if (user) {
            try {
                const userData = JSON.parse(user);
                console.log('User data:', userData);
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
    },

    // Test API client configuration
    testApiClient: () => {
        console.log('🔍 Testing API client configuration...');
        
        // Check if api client is properly configured
        console.log('API base URL:', api.defaults.baseURL);
        console.log('API headers:', api.defaults.headers);
        
        // Test request interceptor
        const testConfig = {
            headers: {},
            url: '/test',
            method: 'get'
        };
        
        // Simulate request interceptor
        const token = localStorage.getItem('token');
        if (token) {
            testConfig.headers.Authorization = `Token ${token}`;
        }
        
        console.log('Test config with token:', testConfig);
    }
};

// Make it available globally for debugging
window.debugApi = debugApi;

export default debugApi; 