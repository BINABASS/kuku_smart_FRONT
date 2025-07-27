// Test script to verify frontend-backend integration
import api from './api';

export const testBackendIntegration = async () => {
  console.log('🧪 Testing Backend Integration...');
  
  try {
    // Test 1: Authentication
    console.log('1. Testing Authentication...');
    const loginResponse = await api.post('/auth/login/', {
      email: 'admin@poultryfarm.com',
      password: 'admin123'
    });
    console.log('✅ Login successful:', loginResponse.data);
    
    // Test 2: Get Devices
    console.log('2. Testing Devices API...');
    const devicesResponse = await api.get('/devices/');
    console.log('✅ Devices fetched:', devicesResponse.data.length, 'devices');
    
    // Test 3: Get Subscriptions
    console.log('3. Testing Subscriptions API...');
    const subscriptionsResponse = await api.get('/subscriptions/');
    console.log('✅ Subscriptions fetched:', subscriptionsResponse.data.length, 'subscriptions');
    
    // Test 4: Get Inventory Items
    console.log('4. Testing Inventory API...');
    const inventoryResponse = await api.get('/inventory/items/');
    console.log('✅ Inventory items fetched:', inventoryResponse.data.length, 'items');
    
    console.log('🎉 All tests passed! Backend integration is working correctly.');
    return true;
    
  } catch (error) {
    console.error('❌ Integration test failed:', error);
    return false;
  }
};

// Auto-run test if this file is imported directly
if (typeof window !== 'undefined') {
  // Only run in browser environment
  window.testBackendIntegration = testBackendIntegration;
} 