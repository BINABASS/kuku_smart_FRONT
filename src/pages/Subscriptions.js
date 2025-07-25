import React, { useState } from 'react';
import { Box, Button, Typography, Grid, Paper, TextField } from '@mui/material';
import SubscriptionList from '../components/subscriptions/SubscriptionList';
import SubscriptionForm from '../components/subscriptions/SubscriptionForm';

const SubscriptionsPage = () => {
    const [openForm, setOpenForm] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenForm = (subscription = null) => {
        setSelectedSubscription(subscription);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setSelectedSubscription(null);
        setOpenForm(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Subscription Management
                    </Typography>
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <TextField
                                    fullWidth
                                    label="Search subscriptions"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by farmer name or plan"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleOpenForm()}
                                    fullWidth
                                >
                                    Add New Subscription
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <SubscriptionList onEdit={handleOpenForm} />
                </Grid>
            </Grid>
            <SubscriptionForm
                open={openForm}
                onClose={handleCloseForm}
                subscription={selectedSubscription}
            />
        </Box>
    );
};

export default SubscriptionsPage;
