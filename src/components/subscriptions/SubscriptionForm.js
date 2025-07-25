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
    MenuItem
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';

const SubscriptionForm = ({ open, onClose, subscription = null }) => {
    const [formData, setFormData] = useState({
        farmerID: '',
        plan_name: '',
        start_date: null,
        end_date: null,
        status: 'active',
    });
    const [farmers, setFarmers] = useState([]);
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        fetchFarmersAndPlans();
    }, []);

    useEffect(() => {
        if (subscription) {
            setFormData({
                farmerID: subscription.farmerID,
                plan_name: subscription.plan_name,
                start_date: new Date(subscription.start_date),
                end_date: new Date(subscription.end_date),
                status: subscription.status,
            });
        }
    }, [subscription]);

    const fetchFarmersAndPlans = async () => {
        try {
            const [farmersRes, plansRes] = await Promise.all([
                axios.get('http://localhost:8000/api/farmers/'),
                axios.get('http://localhost:8000/api/subscription-plans/'),
            ]);
            setFarmers(farmersRes.data);
            setPlans(plansRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (type, date) => {
        setFormData({
            ...formData,
            [type]: date,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                start_date: formData.start_date.toISOString().split('T')[0],
                end_date: formData.end_date.toISOString().split('T')[0],
            };

            if (subscription) {
                await axios.put(`http://localhost:8000/api/subscriptions/${subscription.subscriptionID}/`, data);
            } else {
                await axios.post('http://localhost:8000/api/subscriptions/', data);
            }
            onClose();
        } catch (error) {
            console.error('Error submitting subscription:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{subscription ? 'Edit Subscription' : 'Add New Subscription'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Farmer</InputLabel>
                            <Select
                                name="farmerID"
                                value={formData.farmerID}
                                onChange={handleChange}
                            >
                                {farmers.map((farmer) => (
                                    <MenuItem key={farmer.farmerID} value={farmer.farmerID}>
                                        {farmer.first_name} {farmer.last_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Plan</InputLabel>
                            <Select
                                name="plan_name"
                                value={formData.plan_name}
                                onChange={handleChange}
                            >
                                {plans.map((plan) => (
                                    <MenuItem key={plan.planID} value={plan.plan_name}>
                                        {plan.plan_name} - {plan.description}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <MuiDatePicker
                                label="Start Date"
                                value={formData.start_date}
                                onChange={(date) => handleDateChange('start_date', date)}
                                renderInput={(params) => <TextField {...params} fullWidth required />}
                            />
                            <MuiDatePicker
                                label="End Date"
                                value={formData.end_date}
                                onChange={(date) => handleDateChange('end_date', date)}
                                renderInput={(params) => <TextField {...params} fullWidth required />}
                            />
                        </LocalizationProvider>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="expired">Expired</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {subscription ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default SubscriptionForm;
