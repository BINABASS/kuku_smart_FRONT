import React, { useState } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import ActivityList from '../components/activities/ActivityList';
import ActivityForm from '../components/activities/ActivityForm';

const sampleActivities = [
  {
    activityID: 1,
    batch: { farm: { name: 'Smart Poultry Farm' } },
    batchID: 1,
    activityName: 'First Vaccination',
    activityDescription: 'Give first vaccine at 1 week',
    activityDay: 'Day 7',
    activity_status: 1,
    activity_frequency: 7,
  },
  {
    activityID: 2,
    batch: { farm: { name: 'Zanzibar Chicken Co-op' } },
    batchID: 2,
    activityName: 'Deworming',
    activityDescription: 'Deworm all chickens',
    activityDay: 'Day 14',
    activity_status: 1,
    activity_frequency: 14,
  },
  {
    activityID: 3,
    batch: { farm: { name: 'Dar Urban Poultry' } },
    batchID: 3,
    activityName: 'Growth Check',
    activityDescription: 'Weigh and check growth',
    activityDay: 'Day 21',
    activity_status: 0,
    activity_frequency: 21,
  },
];

const ActivitiesPage = () => {
  const [activities, setActivities] = useState(sampleActivities);
  const [openForm, setOpenForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [usingSampleData] = useState(true); // Always demo mode for now

  const handleOpenForm = (activity = null) => {
    setSelectedActivity(activity);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setSelectedActivity(null);
    setOpenForm(false);
  };

  const handleSave = (newActivity) => {
    if (selectedActivity) {
      // Edit
      setActivities((prev) =>
        prev.map((a) => (a.activityID === selectedActivity.activityID ? { ...a, ...newActivity } : a))
      );
    } else {
      // Add
      const nextID = Math.max(0, ...activities.map((a) => a.activityID)) + 1;
      setActivities((prev) => [
        ...prev,
        { ...newActivity, activityID: nextID, activity_status: 1 },
      ]);
    }
    handleCloseForm();
  };

  const handleDelete = (activityID) => {
    setActivities((prev) => prev.filter((a) => a.activityID !== activityID));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Activity Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenForm()}
          >
            Add New Activity
          </Button>
        </Grid>
        <Grid item xs={12}>
          <ActivityList
            activities={activities}
            onEdit={handleOpenForm}
            onDelete={handleDelete}
            useSample={usingSampleData}
          />
        </Grid>
      </Grid>
      <ActivityForm
        open={openForm}
        onClose={handleCloseForm}
        activity={selectedActivity}
        onSave={handleSave}
        useSample={usingSampleData}
      />
    </Box>
  );
};

export default ActivitiesPage;
