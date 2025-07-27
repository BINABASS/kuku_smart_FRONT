// Debug script for testing API integration
// Run this in browser console

const debugApi = {
  // Test login
  testLogin: async (email = 'admin@poultryfarm.com', password = 'admin123') => {
    console.log('🧪 Testing login...');
    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
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

  // Run all tests
  runAllTests: async () => {
    console.log('🚀 Running all API tests...');
    
    // Test CORS first
    await debugApi.testCORS();
    
    // Test login
    const loginResult = await debugApi.testLogin();
    
    if (loginResult && loginResult.token) {
      // Test devices API with token
      await debugApi.testDevices(loginResult.token);
    }
    
    console.log('🏁 All tests completed!');
  }
};

// Make it available globally
window.debugApi = debugApi;

console.log('🔧 Debug API loaded! Run debugApi.runAllTests() to test everything.'); 