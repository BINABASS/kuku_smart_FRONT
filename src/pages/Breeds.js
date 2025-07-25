import React, { useState } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import BreedList from '../components/breeds/BreedList';
import BreedForm from '../components/breeds/BreedForm';

const sampleBreeds = [
  {
    breedID: 1,
    name: 'Kuroiler',
    description: 'Dual-purpose breed, good for meat and eggs.',
    activities: [{ age: 1, activityTypeID: 1 }],
    conditions: [{ type: 'Temperature', min: 20, max: 30 }],
    feedings: [{ age: 1, food: 'Starter', quantity: 50 }],
  },
  {
    breedID: 2,
    name: 'Sasso',
    description: 'Fast-growing meat breed.',
    activities: [{ age: 2, activityTypeID: 2 }],
    conditions: [{ type: 'Humidity', min: 50, max: 70 }],
    feedings: [{ age: 2, food: 'Grower', quantity: 60 }],
  },
  {
    breedID: 3,
    name: 'Indigenous',
    description: 'Local Tanzanian breed, hardy and disease-resistant.',
    activities: [],
    conditions: [],
    feedings: [],
  },
];

const BreedsPage = () => {
  const [breeds, setBreeds] = useState(sampleBreeds);
  const [openForm, setOpenForm] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [usingSampleData] = useState(true); // Always demo mode for now

  const handleOpenForm = (breed = null) => {
    setSelectedBreed(breed);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setSelectedBreed(null);
    setOpenForm(false);
  };

  const handleSave = (newBreed) => {
    if (selectedBreed) {
      // Edit
      setBreeds((prev) =>
        prev.map((b) => (b.breedID === selectedBreed.breedID ? { ...b, ...newBreed } : b))
      );
    } else {
      // Add
      const nextID = Math.max(0, ...breeds.map((b) => b.breedID)) + 1;
      setBreeds((prev) => [
        ...prev,
        { ...newBreed, breedID: nextID },
      ]);
    }
    handleCloseForm();
  };

  const handleDelete = (breedID) => {
    setBreeds((prev) => prev.filter((b) => b.breedID !== breedID));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Breed Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenForm()}
          >
            Add New Breed
          </Button>
        </Grid>
        <Grid item xs={12}>
          <BreedList
            breeds={breeds}
            onEdit={handleOpenForm}
            onDelete={handleDelete}
            useSample={usingSampleData}
          />
        </Grid>
      </Grid>
      <BreedForm
        open={openForm}
        onClose={handleCloseForm}
        breed={selectedBreed}
        onSave={handleSave}
        useSample={usingSampleData}
      />
    </Box>
  );
};

export default BreedsPage;
