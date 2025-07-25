import React, { useState } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import BatchList from '../components/batches/BatchList';
import BatchForm from '../components/batches/BatchForm';

const sampleBatches = [
  {
    batchID: 1,
    farm_name: 'Smart Poultry Farm',
    breed_name: 'Kuroiler',
    arrive_date: '2024-07-01',
    init_age: 1,
    quantity: 200,
    batch_status: 1,
  },
  {
    batchID: 2,
    farm_name: 'Zanzibar Chicken Co-op',
    breed_name: 'Sasso',
    arrive_date: '2024-07-10',
    init_age: 2,
    quantity: 150,
    batch_status: 1,
  },
  {
    batchID: 3,
    farm_name: 'Dar Urban Poultry',
    breed_name: 'Indigenous',
    arrive_date: '2024-07-15',
    init_age: 1,
    quantity: 100,
    batch_status: 0,
  },
];

const BatchesPage = () => {
  const [batches, setBatches] = useState(sampleBatches);
  const [openForm, setOpenForm] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [usingSampleData] = useState(true); // Always demo mode for now

  const handleOpenForm = (batch = null) => {
    setSelectedBatch(batch);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setSelectedBatch(null);
    setOpenForm(false);
  };

  const handleSave = (newBatch) => {
    if (selectedBatch) {
      // Edit
      setBatches((prev) =>
        prev.map((b) => (b.batchID === selectedBatch.batchID ? { ...b, ...newBatch } : b))
      );
    } else {
      // Add
      const nextID = Math.max(0, ...batches.map((b) => b.batchID)) + 1;
      setBatches((prev) => [
        ...prev,
        { ...newBatch, batchID: nextID, batch_status: 1 },
      ]);
    }
    handleCloseForm();
  };

  const handleDelete = (batchID) => {
    setBatches((prev) => prev.filter((b) => b.batchID !== batchID));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Batch Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenForm()}
          >
            Add New Batch
          </Button>
        </Grid>
        <Grid item xs={12}>
          <BatchList
            batches={batches}
            onEdit={handleOpenForm}
            onDelete={handleDelete}
            useSample={usingSampleData}
          />
        </Grid>
      </Grid>
      <BatchForm
        open={openForm}
        onClose={handleCloseForm}
        batch={selectedBatch}
        onSave={handleSave}
        useSample={usingSampleData}
      />
    </Box>
  );
};

export default BatchesPage;
