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
    CircularProgress
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import api from '../../api/client';

const SubscriptionForm = ({ open, onClose, subscription = null, onSuccess }) => {
    const [formData, setFormData] = useState({
        user: '',
        farm: '',
        plan: '',
        status: 'pending',
        auto_renew: true,
        manager_name: ''
    });
    const [users, setUsers] = useState([]);
    const [farms, setFarms] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open]);

    useEffect(() => {
        if (subscription) {
            setFormData({
                user: subscription.user || '',
                farm: subscription.farm || '',
                plan: subscription.plan || '',
                status: subscription.status || 'pending',
                auto_renew: subscription.auto_renew !== undefined ? subscription.auto_renew : true,
                manager_name: subscription.manager_name || ''
            });
        } else {
            setFormData({
                user: '',
                farm: '',
                plan: '',
                status: 'pending',
                auto_renew: true,
                manager_name: ''
            });
        }
    }, [subscription]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, farmsRes, plansRes] = await Promise.all([
                api.get('/users/'),
                api.get('/farms/'),
                api.get('/subscription-plans/'),
            ]);
            setUsers(usersRes.data);
            setFarms(farmsRes.data);
            setPlans(plansRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load form data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = {
                ...formData,
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
            };

            if (subscription) {
                await api.put(`/subscriptions/${subscription.id}/`, data);
            } else {
                await api.post('/subscriptions/', data);
            }
            
            onSuccess && onSuccess();
            onClose();
        } catch (error) {
            console.error('Error submitting subscription:', error);
            setError(error.response?.data?.message || 'Failed to save subscription. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{subscription ? 'Edit Subscription' : 'Add New Subscription'}</DialogTitle>
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
                                <FormControl fullWidth>
                                    <InputLabel>User</InputLabel>
                                    <Select
                                        name="user"
                                        value={formData.user}
                                        onChange={handleChange}
                                        required
                                    >
                                        {users.map((user) => (
                                            <MenuItem key={user.id} value={user.id}>
                                                {user.email} - {user.first_name} {user.last_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>Farm (Optional)</InputLabel>
                                    <Select
                                        name="farm"
                                        value={formData.farm}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="">
                                            <em>No farm selected</em>
                                        </MenuItem>
                                        {farms.map((farm) => (
                                            <MenuItem key={farm.id} value={farm.id}>
                                                {farm.name} - {farm.location}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>Plan</InputLabel>
                                    <Select
                                        name="plan"
                                        value={formData.plan}
                                        onChange={handleChange}
                                        required
                                    >
                                        {plans.map((plan) => (
                                            <MenuItem key={plan.id} value={plan.id}>
                                                {plan.name} - ${plan.price} ({plan.duration_days} days)
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        required
                                    >
                                        <MenuItem value="pending">Pending</MenuItem>
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="expired">Expired</MenuItem>
                                        <MenuItem value="cancelled">Cancelled</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="Manager Name (Optional)"
                                    name="manager_name"
                                    value={formData.manager_name}
                                    onChange={handleChange}
                                    fullWidth
                                />

                                <FormControl fullWidth>
                                    <InputLabel>Auto Renew</InputLabel>
                                    <Select
                                        name="auto_renew"
                                        value={formData.auto_renew}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={true}>Yes</MenuItem>
                                        <MenuItem value={false}>No</MenuItem>
                                    </Select>
                                </FormControl>
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
                        {loading ? <CircularProgress size={20} /> : (subscription ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default SubscriptionForm;
