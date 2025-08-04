import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Grid,
} from '@mui/material';
import api from '../../api/client';

const FarmerForm = ({ open, onClose, farmer = null, onSuccess }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        address: '',
        farm: '',
        status: true,
    });
    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchFarms();
    }, []);

    useEffect(() => {
        if (farmer) {
            setFormData({
                first_name: farmer.first_name || '',
                last_name: farmer.last_name || '',
                phone: farmer.phone || '',
                email: farmer.user?.email || '',
                address: farmer.address || '',
                farm: farmer.farm?.id || '',
                status: farmer.status !== undefined ? farmer.status : true,
            });
        } else {
            setFormData({
                first_name: '',
                last_name: '',
                phone: '',
                email: '',
                address: '',
                farm: '',
                status: true,
            });
        }
    }, [farmer]);

    const fetchFarms = async () => {
        try {
            const response = await api.get('/farms/');
            setFarms(response.data);
        } catch (error) {
            console.error('Error fetching farms:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        if (!formData.first_name.trim()) {
            setError('Please enter a first name');
            return false;
        }
        if (!formData.last_name.trim()) {
            setError('Please enter a last name');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Please enter an email address');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Please enter a phone number');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let submitData = {
                ...formData,
                farm: formData.farm || null,
            };

            if (farmer) {
                // Update existing farmer
                await api.put(`/farmers/${farmer.id}/`, submitData);
                setSuccess('Farmer updated successfully!');
            } else {
                // Create new farmer
                await api.post('/farmers/', submitData);
                setSuccess('Farmer created successfully!');
            }

            setTimeout(() => {
                onSuccess && onSuccess();
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Error submitting farmer:', error);
            setError(error.response?.data?.message || 'Failed to save farmer');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError('');
        setSuccess('');
        setFormData({
            first_name: '',
            last_name: '',
            phone: '',
            email: '',
            address: '',
            farm: '',
            status: true,
        });
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth="md" 
            fullWidth
            disableEnforceFocus 
            disableAutoFocus 
            keepMounted={false}
            aria-labelledby="farmer-dialog-title"
        >
            <DialogTitle id="farmer-dialog-title">
                {farmer ? 'Edit Farmer' : 'Add New Farmer'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
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

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="First Name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Last Name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Farm</InputLabel>
                                    <Select
                                        name="farm"
                                        value={formData.farm}
                                        onChange={handleChange}
                                        label="Farm"
                                    >
                                        <MenuItem value="">No Farm</MenuItem>
                                        {farms.map((farm) => (
                                            <MenuItem key={farm.id} value={farm.id}>
                                                {farm.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        label="Status"
                                    >
                                        <MenuItem value={true}>Active</MenuItem>
                                        <MenuItem value={false}>Inactive</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} /> : (farmer ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default FarmerForm;
