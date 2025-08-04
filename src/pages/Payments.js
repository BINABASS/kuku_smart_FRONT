import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, Alert } from '@mui/material';
import PaymentList from '../components/payments/PaymentList';
import PaymentForm from '../components/payments/PaymentForm';

const PaymentsPage = () => {
    const [openForm, setOpenForm] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleOpenForm = (payment = null) => {
        setSelectedPayment(payment);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setSelectedPayment(null);
        setOpenForm(false);
    };

    const handleSuccess = () => {
        setSuccessMessage('Payment saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Payment Management
                    </Typography>
                    {successMessage && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {successMessage}
                        </Alert>
                    )}
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <TextField
                                    fullWidth
                                    label="Search payments"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by user email or subscription"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleOpenForm()}
                                    fullWidth
                                >
                                    Add New Payment
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <PaymentList onEdit={handleOpenForm} onSuccess={handleSuccess} />
                </Grid>
            </Grid>
            <PaymentForm
                open={openForm}
                onClose={handleCloseForm}
                payment={selectedPayment}
                onSuccess={handleSuccess}
            />
        </Box>
    );
};

export default PaymentsPage; 