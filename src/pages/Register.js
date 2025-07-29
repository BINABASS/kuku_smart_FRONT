import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Container, CssBaseline, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Alert, Link, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PersonAdd } from '@mui/icons-material';
import { register } from '../store/authSlice';

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        farmName: '',
        position: '',
        department: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Validate form data
    const validateForm = () => {
        if (!formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
            setError('Please fill in all required fields');
            return false;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            setLoading(true);
            setError('');
            
            // Split full name into first and last name
            const nameParts = formData.fullName.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            // Prepare data for backend
            const registrationData = {
                email: formData.email,
                password: formData.password,
                username: formData.email, // Use email as username
                role: formData.role,
                first_name: firstName,
                last_name: lastName,
                // Additional fields for future use
                farm_name: formData.farmName,
                position: formData.position,
                department: formData.department
            };
            
            console.log('Sending registration data:', registrationData);
            
            const result = await dispatch(register(registrationData));
            
            if (register.fulfilled.match(result)) {
                console.log('Registration successful');
                navigate('/login');
            } else if (register.rejected.match(result)) {
                console.log('Registration failed:', result.payload);
                setError(result.payload || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm" sx={{
            height: 'fit-content',
            minHeight: 'auto'
        }}>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 3,
                    p: 4,
                    width: '100%',
                    maxWidth: 600,
                }}
            >
                <Avatar
                    sx={{
                        m: 1,
                        bgcolor: 'primary.main',
                        width: 64,
                        height: 64,
                        boxShadow: 3,
                    }}
                >
                    <PersonAdd />
                </Avatar>
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        mt: 2,
                        mb: 1,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'primary.main',
                    }}
                >
                    Sign up
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                        mb: 3,
                        textAlign: 'center',
                        color: 'text.secondary',
                    }}
                >
                    Create your account
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="fullName"
                        label="Full Name"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="email"
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <FormControl margin="normal" fullWidth>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            value={formData.role}
                            label="Role"
                            onChange={handleChange}
                            name="role"
                        >
                            <MenuItem value="admin">Farm Administrator</MenuItem>
                            <MenuItem value="manager">Farm Manager</MenuItem>
                        </Select>
                    </FormControl>
                    {formData.role === 'admin' && (
                        <>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="position"
                                label="Position"
                                type="text"
                                value={formData.position}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="farmName"
                                label="Farm Name"
                                type="text"
                                value={formData.farmName}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            />
                        </>
                    )}
                    {formData.role === 'manager' && (
                        <>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="department"
                                label="Department"
                                type="text"
                                value={formData.department}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="farmName"
                                label="Farm Name"
                                type="text"
                                value={formData.farmName}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            />
                        </>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Already have an account?{' '}
                        <Link component={RouterLink} to="/login" sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            fontWeight: 'medium',
                            '&:hover': {
                                textDecoration: 'underline',
                                color: 'primary.dark'
                            }
                        }}>
                            Sign in
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}
