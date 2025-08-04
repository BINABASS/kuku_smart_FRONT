import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    Paper,
    Container
} from '@mui/material';
import api from '../api/client';

const SimpleAuthTest = () => {
    const [credentials, setCredentials] = useState({
        email: 'admin@poultryfarm.com',
        password: 'admin123'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token'));

    const handleLogin = async () => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const response = await api.post('/auth/login/', credentials);
            
            // Store token
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setToken(response.data.token);
            
            setSuccess(`Login successful! Token: ${response.data.token.substring(0, 20)}...`);
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setSuccess('Logged out successfully');
    };

    const testSubscriptionAPI = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await api.get('/subscriptions/');
            setSuccess(`Subscriptions API working! Found ${response.data.length} subscriptions`);
        } catch (error) {
            console.error('Subscription API error:', error);
            setError('Subscription API failed: ' + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    const testPaymentAPI = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await api.get('/payments/');
            setSuccess(`Payments API working! Found ${response.data.length} payments`);
        } catch (error) {
            console.error('Payment API error:', error);
            setError('Payment API failed: ' + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Authentication Test
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Current Status
                    </Typography>
                    <Typography>
                        Token: {token ? '✅ Present' : '❌ Missing'}
                    </Typography>
                    {token && (
                        <Typography variant="body2" color="text.secondary">
                            Token: {token.substring(0, 20)}...
                        </Typography>
                    )}
                </Box>

                {!token ? (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Login
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <TextField
                                label="Email"
                                value={credentials.email}
                                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                                fullWidth
                            />
                            <TextField
                                label="Password"
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                fullWidth
                            />
                        </Box>
                        <Button 
                            variant="contained" 
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            API Tests
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button 
                                variant="outlined" 
                                onClick={testSubscriptionAPI}
                                disabled={loading}
                            >
                                Test Subscriptions API
                            </Button>
                            <Button 
                                variant="outlined" 
                                onClick={testPaymentAPI}
                                disabled={loading}
                            >
                                Test Payments API
                            </Button>
                            <Button 
                                variant="outlined" 
                                onClick={handleLogout}
                                color="error"
                            >
                                Logout
                            </Button>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default SimpleAuthTest; 