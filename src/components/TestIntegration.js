import React, { useState } from 'react';
import { Box, Button, Typography, Alert, TextField } from '@mui/material';
import api from '../utils/api';

const TestIntegration = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: 'admin@poultryfarm.com',
    password: 'admin123'
  });

  const testLogin = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      console.log('Testing login with:', credentials);
      const response = await api.post('/auth/login/', credentials);
      console.log('Login successful:', response.data);
      setTestResult({
        success: true,
        message: 'Login successful!',
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

  return (
    <Box sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h4" gutterBottom>
        Backend Integration Test
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Credentials
        </Typography>
        <TextField
          fullWidth
          label="Email"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
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
          Test Login
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
      </Box>
    </Box>
  );
};

export default TestIntegration; 