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
} from '@mui/material';
import axios from 'axios';

const FarmerForm = ({ open, onClose, farmer = null, onSave, useSample }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        address: '',
        farm: null,
    });
    const [farms, setFarms] = useState([]);

    useEffect(() => {
        fetchFarms();
    }, []);

    useEffect(() => {
        if (farmer) {
            setFormData({
                first_name: farmer.first_name || '',
                last_name: farmer.last_name || '',
                phone: farmer.phone || '',
                email: farmer.user?.email || farmer.email || '',
                address: farmer.address || '',
                farm: farmer.farm?.farmID || '',
            });
        } else {
            setFormData({
                first_name: '',
                last_name: '',
                phone: '',
                email: '',
                address: '',
                farm: '',
            });
        }
    }, [farmer]);

    const fetchFarms = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/farms/');
            setFarms(response.data);
        } catch (error) {
            console.error('Error fetching farms:', error);
            // Provide sample farms for demo
            setFarms([
                { farmID: 1, name: 'Smart Poultry Farm' },
                { farmID: 2, name: 'Zanzibar Chicken Co-op' },
                { farmID: 3, name: 'Dar Urban Poultry' },
            ]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (useSample) {
            // Demo mode: just call onSave with formData
            onSave({
                ...formData,
                username: formData.email,
                fullName: formData.first_name + ' ' + formData.last_name,
            });
            onClose();
            return;
        }
        try {
            // First create/update user
            const userResponse = await axios.post('http://localhost:8000/api/users/', {
                email: formData.email,
                username: formData.email,
                is_farmer: true,
            });

            // Then create/update farmer
            const farmerData = {
                ...formData,
                user: userResponse.data.id,
            };

            if (farmer) {
                await axios.put(`http://localhost:8000/api/farmers/${farmer.farmerID}/`, farmerData);
            } else {
                await axios.post('http://localhost:8000/api/farmers/', farmerData);
            }
            onSave({
                ...formData,
                username: formData.email,
                fullName: formData.first_name + ' ' + formData.last_name,
            });
            onClose();
        } catch (error) {
            console.error('Error submitting farmer:', error);
            if (useSample) {
                // Fallback to demo mode if API fails
                onSave({
                    ...formData,
                    username: formData.email,
                    fullName: formData.first_name + ' ' + formData.last_name,
                });
                onClose();
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{farmer ? 'Edit Farmer' : 'Add New Farmer'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="First Name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Last Name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Farm</InputLabel>
                            <Select
                                name="farm"
                                value={formData.farm}
                                onChange={handleChange}
                            >
                                <MenuItem value={null}>No Farm</MenuItem>
                                {farms.map((farm) => (
                                    <MenuItem key={farm.farmID} value={farm.farmID}>
                                        {farm.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {farmer ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default FarmerForm;
