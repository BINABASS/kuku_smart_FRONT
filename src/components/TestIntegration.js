import React, { useState } from 'react';
import { Box, Button, Typography, Alert, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import api from '../utils/api';

const TestIntegration = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState('admin');
  const [credentials, setCredentials] = useState({
    admin: {
      email: 'admin@poultryfarm.com',
      password: 'admin123'
    },
    manager: {
      email: 'manager@poultryfarm.com',
      password: 'manager123'
    }
  });

  const getCurrentCredentials = () => {
    return credentials[selectedUser];
  };

  const testLogin = async () => {
    setLoading(true);
    setTestResult(null);
    
    const currentCreds = getCurrentCredentials();
    
    try {
      console.log(`Testing ${selectedUser} login with:`, currentCreds);
      const response = await api.post('/auth/login/', currentCreds);
      console.log('Login successful:', response.data);
      setTestResult({
        success: true,
        message: `${selectedUser.charAt(0).toUpperCase() + selectedUser.slice(1)} login successful!`,
        data: response.data
      });
    } catch (error) {
      console.error('Login failed:', error);
      setTestResult({
        success: false,
        message: `Login failed: ${error.response?.data?.error || error.message}`,
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  const testDevices = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      const response = await api.get('/devices/');
      console.log('Devices fetched:', response.data);
      setTestResult({
        success: true,
        message: `Devices fetched successfully! Found ${response.data.length} devices.`,
        data: response.data
      });
    } catch (error) {
      console.error('Devices fetch failed:', error);
      setTestResult({
        success: false,
        message: `Devices fetch failed: ${error.response?.data?.error || error.message}`,
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  const testBothUsers = async () => {
    setLoading(true);
    setTestResult(null);
    
    const results = [];
    
    // Test admin login
    try {
      const adminResponse = await api.post('/auth/login/', credentials.admin);
      results.push({
        user: 'admin',
        success: true,
        data: adminResponse.data
      });
    } catch (error) {
      results.push({
        user: 'admin',
        success: false,
        error: error.response?.data?.error || error.message
      });
    }
    
    // Test manager login
    try {
      const managerResponse = await api.post('/auth/login/', credentials.manager);
      results.push({
        user: 'manager',
        success: true,
        data: managerResponse.data
      });
    } catch (error) {
      results.push({
        user: 'manager',
        success: false,
        error: error.response?.data?.error || error.message
      });
    }
    
    const allSuccess = results.every(r => r.success);
    setTestResult({
      success: allSuccess,
      message: allSuccess ? 'Both users login successfully!' : 'Some logins failed',
      data: results
    });
    
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <Typography variant="h4" gutterBottom>
        Backend Integration Test
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Configuration
        </Typography>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select User</InputLabel>
          <Select
            value={selectedUser}
            label="Select User"
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <MenuItem value="admin">Admin User</MenuItem>
            <MenuItem value="manager">Manager User</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          fullWidth
          label="Email"
          value={getCurrentCredentials().email}
          onChange={(e) => setCredentials({
            ...credentials,
            [selectedUser]: { ...getCurrentCredentials(), email: e.target.value }
          })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={getCurrentCredentials().password}
          onChange={(e) => setCredentials({
            ...credentials,
            [selectedUser]: { ...getCurrentCredentials(), password: e.target.value }
          })}
          sx={{ mb: 2 }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={testLogin}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          Test {selectedUser.charAt(0).toUpperCase() + selectedUser.slice(1)} Login
        </Button>
        <Button
          variant="contained"
          onClick={testBothUsers}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          Test Both Users
        </Button>
        <Button
          variant="contained"
          onClick={testDevices}
          disabled={loading}
        >
          Test Devices API
        </Button>
      </Box>

      {loading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Testing...
        </Alert>
      )}

      {testResult && (
        <Alert 
          severity={testResult.success ? 'success' : 'error'}
          sx={{ mb: 2 }}
        >
          <Typography variant="body1" gutterBottom>
            {testResult.message}
          </Typography>
          {testResult.data && (
            <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem', mt: 1 }}>
              {JSON.stringify(testResult.data, null, 2)}
            </Typography>
          )}
        </Alert>
      )}

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Backend Status
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Backend URL: http://localhost:8000
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Frontend URL: http://localhost:3000
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          <strong>Test Users:</strong>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          • Admin: admin@poultryfarm.com / admin123
        </Typography>
        <Typography variant="body2" color="textSecondary">
          • Manager: manager@poultryfarm.com / manager123
        </Typography>
      </Box>
    </Box>
  );
};

export default TestIntegration; 