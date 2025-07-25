import React, { useState } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import FeedingList from '../components/feedings/FeedingList';
import FeedingForm from '../components/feedings/FeedingForm';

const sampleFeedings = [
  {
    batchFeedingID: 1,
    batch: { farm: { name: 'Smart Poultry Farm' }, breed: { name: 'Kuroiler' } },
    batchID: 1,
    feeding_date: '2024-07-01',
    feeding_amount: 50,
    status: 1,
  },
  {
    batchFeedingID: 2,
    batch: { farm: { name: 'Zanzibar Chicken Co-op' }, breed: { name: 'Sasso' } },
    batchID: 2,
    feeding_date: '2024-07-10',
    feeding_amount: 60,
    status: 1,
  },
  {
    batchFeedingID: 3,
    batch: { farm: { name: 'Dar Urban Poultry' }, breed: { name: 'Indigenous' } },
    batchID: 3,
    feeding_date: '2024-07-15',
    feeding_amount: 40,
    status: 0,
  },
];

const FeedingsPage = () => {
  const [feedings, setFeedings] = useState(sampleFeedings);
  const [openForm, setOpenForm] = useState(false);
  const [selectedFeeding, setSelectedFeeding] = useState(null);
  const [usingSampleData] = useState(true); // Always demo mode for now

  const handleOpenForm = (feeding = null) => {
    setSelectedFeeding(feeding);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setSelectedFeeding(null);
    setOpenForm(false);
  };

  const handleSave = (newFeeding) => {
    if (selectedFeeding) {
      // Edit
      setFeedings((prev) =>
        prev.map((f) => (f.batchFeedingID === selectedFeeding.batchFeedingID ? { ...f, ...newFeeding } : f))
      );
    } else {
      // Add
      const nextID = Math.max(0, ...feedings.map((f) => f.batchFeedingID)) + 1;
      setFeedings((prev) => [
        ...prev,
        { ...newFeeding, batchFeedingID: nextID, status: 1 },
      ]);
    }
    handleCloseForm();
  };

  const handleDelete = (batchFeedingID) => {
    setFeedings((prev) => prev.filter((f) => f.batchFeedingID !== batchFeedingID));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Feeding Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenForm()}
          >
            Add New Feeding
          </Button>
        </Grid>
        <Grid item xs={12}>
          <FeedingList
            feedings={feedings}
            onEdit={handleOpenForm}
            onDelete={handleDelete}
            useSample={usingSampleData}
          />
        </Grid>
      </Grid>
      <FeedingForm
        open={openForm}
        onClose={handleCloseForm}
        feeding={selectedFeeding}
        onSave={handleSave}
        useSample={usingSampleData}
      />
    </Box>
  );
};

export default FeedingsPage;
