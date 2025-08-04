import React, { useState } from 'react';
import { Box, Button, Typography, Grid, Alert } from '@mui/material';
import SubscriptionPlansList from '../components/subscription-plans/SubscriptionPlansList';
import SubscriptionPlansForm from '../components/subscription-plans/SubscriptionPlansForm';

const SubscriptionPlansPage = () => {
    const [openForm, setOpenForm] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleOpenForm = (plan = null) => {
        setSelectedPlan(plan);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setSelectedPlan(null);
        setOpenForm(false);
    };

    const handleSuccess = () => {
        setSuccessMessage('Subscription plan saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Subscription Plans Management
                    </Typography>
                    {successMessage && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {successMessage}
                        </Alert>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenForm()}
                        sx={{ mb: 2 }}
                    >
                        Add New Plan
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <SubscriptionPlansList onEdit={handleOpenForm} onSuccess={handleSuccess} />
                </Grid>
            </Grid>
            <SubscriptionPlansForm
                open={openForm}
                onClose={handleCloseForm}
                plan={selectedPlan}
                onSuccess={handleSuccess}
            />
        </Box>
    );
};

export default SubscriptionPlansPage;
