import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import api from '../../api/client';

const PaymentForm = ({ open, onClose, payment = null, onSuccess }) => {
    const [formData, setFormData] = useState({
        subscription: '',
        amount: '',
        currency: 'USD',
        payment_method: 'credit_card',
        status: 'pending',
        transaction_id: '',
        manager_name: ''
    });
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            fetchSubscriptions();
        }
    }, [open]);

    useEffect(() => {
        if (payment) {
            setFormData({
                subscription: payment.subscription || '',
                amount: payment.amount || '',
                currency: payment.currency || 'USD',
                payment_method: payment.payment_method || 'credit_card',
                status: payment.status || 'pending',
                transaction_id: payment.transaction_id || '',
                manager_name: payment.manager_name || ''
            });
        } else {
            setFormData({
                subscription: '',
                amount: '',
                currency: 'USD',
                payment_method: 'credit_card',
                status: 'pending',
                transaction_id: '',
                manager_name: ''
            });
        }
    }, [payment]);

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/subscriptions/');
            setSubscriptions(response.data);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            setError('Failed to load subscriptions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (payment) {
                await api.put(`/payments/${payment.id}/`, formData);
            } else {
                await api.post('/payments/', formData);
            }
            
            onSuccess && onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving payment:', error);
            setError(error.response?.data?.message || 'Failed to save payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            disableEnforceFocus
            disableAutoFocus
            keepMounted={false}
            aria-labelledby="payment-dialog-title"
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle id="payment-dialog-title">
                    {payment ? 'Edit Payment' : 'New Payment'}
                </DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <FormControl fullWidth>
                                    <InputLabel>Subscription</InputLabel>
                                    <Select
                                        name="subscription"
                                        value={formData.subscription}
                                        onChange={handleChange}
                                        required
                                    >
                                        {subscriptions.map((subscription) => (
                                            <MenuItem key={subscription.id} value={subscription.id}>
                                                {subscription.user_email} - {subscription.plan_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Amount"
                                    name="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                    inputProps={{ min: 0, step: 0.01 }}
                                />

                                <FormControl fullWidth>
                                    <InputLabel>Currency</InputLabel>
                                    <Select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        required
                                    >
                                        <MenuItem value="USD">USD</MenuItem>
                                        <MenuItem value="EUR">EUR</MenuItem>
                                        <MenuItem value="GBP">GBP</MenuItem>
                                        <MenuItem value="TZS">TZS</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>Payment Method</InputLabel>
                                    <Select
                                        name="payment_method"
                                        value={formData.payment_method}
                                        onChange={handleChange}
                                        required
                                    >
                                        <MenuItem value="credit_card">Credit Card</MenuItem>
                                        <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                                        <MenuItem value="mobile_money">Mobile Money</MenuItem>
                                        <MenuItem value="paypal">PayPal</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Transaction ID (Optional)"
                                    name="transaction_id"
                                    value={formData.transaction_id}
                                    onChange={handleChange}
                                />

                                <TextField
                                    fullWidth
                                    label="Manager Name (Optional)"
                                    name="manager_name"
                                    value={formData.manager_name}
                                    onChange={handleChange}
                                />

                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        required
                                    >
                                        <MenuItem value="pending">Pending</MenuItem>
                                        <MenuItem value="completed">Completed</MenuItem>
                                        <MenuItem value="failed">Failed</MenuItem>
                                        <MenuItem value="refunded">Refunded</MenuItem>
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
                        {loading ? <CircularProgress size={20} /> : (payment ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default PaymentForm;
