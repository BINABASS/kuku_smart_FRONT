import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { registerFarmer } from '../store/authSlice';

const FarmerRegistration = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        farmName: '',
        farmLocation: '',
        farmSize: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Dispatch the registration action
            await dispatch(registerFarmer(formData));
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Farmer Registration
            </Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Farm Name"
                            name="farmName"
                            value={formData.farmName}
                            onChange={handleChange}
                            required
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Farm Location"
                            name="farmLocation"
                            value={formData.farmLocation}
                            onChange={handleChange}
                            required
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Farm Size (acres)"
                            name="farmSize"
                            type="number"
                            value={formData.farmSize}
                            onChange={handleChange}
                            required
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                        >
                            Register
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default FarmerRegistration;
