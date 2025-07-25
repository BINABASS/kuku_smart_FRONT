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
  Box
} from '@mui/material';
import api from '../../utils/api';

const PaymentForm = ({ open, onClose, payment = null }) => {
    const [formData, setFormData] = useState({
        farmerName: '',
        subscriptionPlan: '',
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        status: 'pending'
    });

    useEffect(() => {
        if (payment) {
            setFormData({
                farmerName: payment.farmerName,
                subscriptionPlan: payment.subscriptionPlan,
                amount: payment.amount,
                paymentDate: payment.paymentDate,
                status: payment.status
            });
        }
    }, [payment]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (payment) {
                await api.put(`/payments/${payment.id}`, formData);
            } else {
                await api.post('/payments', formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving payment:', error);
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
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>{payment ? 'Edit Payment' : 'New Payment'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Farmer Name"
                            name="farmerName"
                            value={formData.farmerName}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Subscription Plan"
                            name="subscriptionPlan"
                            value={formData.subscriptionPlan}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Amount"
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Payment Date"
                            name="paymentDate"
                            type="date"
                            value={formData.paymentDate}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                label="Status"
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="paid">Paid</MenuItem>
                                <MenuItem value="failed">Failed</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        {payment ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default PaymentForm;
