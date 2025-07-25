import React, { useState } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import SubscriptionPlansList from '../components/subscription-plans/SubscriptionPlansList';
import SubscriptionPlansForm from '../components/subscription-plans/SubscriptionPlansForm';

const SubscriptionPlansPage = () => {
    const [openForm, setOpenForm] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const handleOpenForm = (plan = null) => {
        setSelectedPlan(plan);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setSelectedPlan(null);
        setOpenForm(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Subscription Plans Management
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenForm()}
                    >
                        Add New Plan
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <SubscriptionPlansList onEdit={handleOpenForm} />
                </Grid>
            </Grid>
            <SubscriptionPlansForm
                open={openForm}
                onClose={handleCloseForm}
                plan={selectedPlan}
            />
        </Box>
    );
};

export default SubscriptionPlansPage;
