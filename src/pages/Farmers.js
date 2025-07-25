import React, { useState } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import FarmerList from '../components/farmers/FarmerList';
import FarmerForm from '../components/farmers/FarmerForm';

const FarmersPage = () => {
    const [openForm, setOpenForm] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState(null);

    const handleOpenForm = (farmer = null) => {
        setSelectedFarmer(farmer);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setSelectedFarmer(null);
        setOpenForm(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Farmer Management
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenForm()}
                    >
                        Add New Farmer
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <FarmerList onEdit={handleOpenForm} />
                </Grid>
            </Grid>
            <FarmerForm
                open={openForm}
                onClose={handleCloseForm}
                farmer={selectedFarmer}
            />
        </Box>
    );
};

export default FarmersPage;
