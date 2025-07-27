// Debug script for testing API integration
// Run this in browser console

const debugApi = {
  // Test login with detailed logging
  testLogin: async (email = 'admin@poultryfarm.com', password = 'admin123') => {
    console.log('🧪 Testing login...');
    console.log('Request URL:', 'http://localhost:8000/api/auth/login/');
    console.log('Request payload:', { email, password });
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);
      console.log('Response headers:', response.headers);
      console.log('Response URL:', response.url);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        console.log('✅ Login successful!');
        return data;
      } else {
        console.log('❌ Login failed:', data);
        return null;
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      return null;
    }
  },

  // Test login using axios (same as frontend)
  testLoginAxios: async (email = 'admin@poultryfarm.com', password = 'admin123') => {
    console.log('🧪 Testing login with axios...');
    
    try {
      const axios = await import('axios');
      const response = await axios.default.post('http://localhost:8000/api/auth/login/', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Axios response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Axios error:', error.response || error);
      return null;
    }
  },

  // Test devices API
  testDevices: async (token) => {
    console.log('🧪 Testing devices API...');
    try {
      const response = await fetch('http://localhost:8000/api/devices/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        console.log('✅ Devices API successful!');
        return data;
      } else {
        console.log('❌ Devices API failed:', data);
        return null;
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      return null;
    }
  },

  // Test CORS
  testCORS: async () => {
    console.log('🧪 Testing CORS...');
    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type',
        }
      });
      
      console.log('CORS Response status:', response.status);
      console.log('CORS Response headers:', response.headers);
      
      if (response.ok) {
        console.log('✅ CORS is working!');
      } else {
        console.log('❌ CORS issue detected');
      }
    } catch (error) {
      console.error('❌ CORS test failed:', error);
    }
  },

  // Test the actual frontend API instance
  testFrontendApi: async () => {
    console.log('🧪 Testing frontend API instance...');
    try {
      // Import the actual API instance used by the frontend
      const api = await import('./api.js');
      const response = await api.default.post('/auth/login/', {
        email: 'admin@poultryfarm.com',
        password: 'admin123'
      });
      
      console.log('Frontend API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Frontend API error:', error.response || error);
      return null;
    }
  },

  // Run all tests
  runAllTests: async () => {
    console.log('🚀 Running all API tests...');
    
    // Test CORS first
    await debugApi.testCORS();
    
    // Test fetch login
    const fetchResult = await debugApi.testLogin();
    
    // Test axios login
    const axiosResult = await debugApi.testLoginAxios();
    
    // Test frontend API
    const frontendResult = await debugApi.testFrontendApi();
    
    if (fetchResult && fetchResult.token) {
      // Test devices API with token
      await debugApi.testDevices(fetchResult.token);
    }
    
    console.log('🏁 All tests completed!');
    console.log('Results:', {
      fetch: fetchResult ? 'SUCCESS' : 'FAILED',
      axios: axiosResult ? 'SUCCESS' : 'FAILED',
      frontend: frontendResult ? 'SUCCESS' : 'FAILED'
    });
  }
};

// Make it available globally
window.debugApi = debugApi;

console.log('🔧 Debug API loaded! Run debugApi.runAllTests() to test everything.'); 