import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tab,
    Tabs,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const SubscriptionPlansForm = ({ open, onClose, plan = null }) => {
    const [formData, setFormData] = useState({
        plan_name: '',
        description: '',
        price: '',
        duration: 1,
        features: [],
    });

    useEffect(() => {
        if (plan) {
            setFormData({
                plan_name: plan.plan_name,
                description: plan.description,
                price: plan.price,
                duration: plan.duration,
                features: plan.features?.split(',') || [],
            });
        }
    }, [plan]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFeatureAdd = (feature) => {
        setFormData({
            ...formData,
            features: [...formData.features, feature],
        });
    };

    const handleFeatureDelete = (featureToDelete) => {
        setFormData({
            ...formData,
            features: formData.features.filter(feature => feature !== featureToDelete),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                features: formData.features.join(','),
            };

            if (plan) {
                await axios.put(`http://localhost:8000/api/subscription-plans/${plan.planID}/`, data);
            } else {
                await axios.post('http://localhost:8000/api/subscription-plans/', data);
            }
            onClose();
        } catch (error) {
            console.error('Error submitting subscription plan:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{plan ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Plan Name"
                            name="plan_name"
                            value={formData.plan_name}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                        />
                        <TextField
                            label="Price ($)"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            type="number"
                            fullWidth
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel>Duration (months)</InputLabel>
                            <Select
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                            >
                                {[1, 3, 6, 12, 24].map((months) => (
                                    <MenuItem key={months} value={months}>
                                        {months} months
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <TextField
                                label="Add Feature"
                                fullWidth
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                        handleFeatureAdd(e.target.value.trim());
                                        e.target.value = '';
                                    }
                                }}
                            />
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {formData.features.map((feature) => (
                                    <Chip
                                        key={feature}
                                        label={feature}
                                        onDelete={() => handleFeatureDelete(feature)}
                                        size="small"
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {plan ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default SubscriptionPlansForm;
