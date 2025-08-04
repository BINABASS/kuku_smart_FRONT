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
    Alert,
    CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../../api/client';

const SubscriptionPlansForm = ({ open, onClose, plan = null, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'basic',
        description: '',
        price: '',
        duration_days: 30,
        max_devices: 10,
        max_sensors: 50,
        max_batches: 5,
        features: [],
        is_active: true
    });
    const [newFeature, setNewFeature] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name || '',
                type: plan.type || 'basic',
                description: plan.description || '',
                price: plan.price || '',
                duration_days: plan.duration_days || 30,
                max_devices: plan.max_devices || 10,
                max_sensors: plan.max_sensors || 50,
                max_batches: plan.max_batches || 5,
                features: plan.features ? Object.values(plan.features) : [],
                is_active: plan.is_active !== undefined ? plan.is_active : true
            });
        } else {
            setFormData({
                name: '',
                type: 'basic',
                description: '',
                price: '',
                duration_days: 30,
                max_devices: 10,
                max_sensors: 50,
                max_batches: 5,
                features: [],
                is_active: true
            });
        }
    }, [plan]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFeatureAdd = () => {
        if (newFeature.trim()) {
            setFormData({
                ...formData,
                features: [...formData.features, newFeature.trim()]
            });
            setNewFeature('');
        }
    };

    const handleFeatureDelete = (featureToDelete) => {
        setFormData({
            ...formData,
            features: formData.features.filter(feature => feature !== featureToDelete),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = {
                ...formData,
                price: parseFloat(formData.price),
                duration_days: parseInt(formData.duration_days),
                max_devices: parseInt(formData.max_devices),
                max_sensors: parseInt(formData.max_sensors),
                max_batches: parseInt(formData.max_batches),
                features: formData.features.reduce((acc, feature, index) => {
                    acc[`feature_${index}`] = feature;
                    return acc;
                }, {})
            };

            if (plan) {
                await api.put(`/subscription-plans/${plan.id}/`, data);
            } else {
                await api.post('/subscription-plans/', data);
            }
            
            onSuccess && onSuccess();
            onClose();
        } catch (error) {
            console.error('Error submitting subscription plan:', error);
            setError(error.response?.data?.message || 'Failed to save subscription plan. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{plan ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <TextField
                                    label="Plan Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                                
                                <FormControl fullWidth>
                                    <InputLabel>Plan Type</InputLabel>
                                    <Select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <MenuItem value="basic">Basic</MenuItem>
                                        <MenuItem value="premium">Premium</MenuItem>
                                        <MenuItem value="enterprise">Enterprise</MenuItem>
                                    </Select>
                                </FormControl>

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
                                    label="Price"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    inputProps={{ min: 0, step: 0.01 }}
                                />

                                <TextField
                                    label="Duration (Days)"
                                    name="duration_days"
                                    type="number"
                                    value={formData.duration_days}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    inputProps={{ min: 1 }}
                                />

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField
                                        label="Max Devices"
                                        name="max_devices"
                                        type="number"
                                        value={formData.max_devices}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        inputProps={{ min: 1 }}
                                    />
                                    <TextField
                                        label="Max Sensors"
                                        name="max_sensors"
                                        type="number"
                                        value={formData.max_sensors}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        inputProps={{ min: 1 }}
                                    />
                                    <TextField
                                        label="Max Batches"
                                        name="max_batches"
                                        type="number"
                                        value={formData.max_batches}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        inputProps={{ min: 1 }}
                                    />
                                </Box>

                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        name="is_active"
                                        value={formData.is_active}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={true}>Active</MenuItem>
                                        <MenuItem value={false}>Inactive</MenuItem>
                                    </Select>
                                </FormControl>

                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Features
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                        <TextField
                                            label="Add Feature"
                                            value={newFeature}
                                            onChange={(e) => setNewFeature(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleFeatureAdd())}
                                            fullWidth
                                        />
                                        <IconButton onClick={handleFeatureAdd} color="primary">
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {formData.features.map((feature, index) => (
                                            <Chip
                                                key={index}
                                                label={feature}
                                                onDelete={() => handleFeatureDelete(feature)}
                                                color="primary"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} /> : (plan ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default SubscriptionPlansForm;
