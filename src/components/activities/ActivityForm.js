import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import axios from 'axios';

const ActivityForm = ({ open, onClose, activity = null, onSave, useSample }) => {
    const [formData, setFormData] = useState({
        batchID: '',
        activityName: '',
        activityDescription: '',
        activityDay: '',
        activity_status: true,
        activity_frequency: 1,
    });
    const [batches, setBatches] = useState([]);

    useEffect(() => {
        fetchBatches();
    }, []);

    useEffect(() => {
        if (activity) {
            setFormData({
                batchID: activity.batchID,
                activityName: activity.activityName,
                activityDescription: activity.activityDescription,
                activityDay: activity.activityDay,
                activity_status: activity.activity_status === 1,
                activity_frequency: activity.activity_frequency,
            });
        }
    }, [activity]);

    const fetchBatches = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/batches/');
            setBatches(response.data);
        } catch (error) {
            console.error('Error fetching batches:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? e.target.checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (useSample) {
            onSave(formData);
            onClose();
            return;
        }
        try {
            const data = {
                ...formData,
                activity_status: formData.activity_status ? 1 : 0,
            };

            if (activity) {
                await axios.put(`http://localhost:8000/api/activity-schedules/${activity.activityID}/`, data);
            } else {
                await axios.post('http://localhost:8000/api/activity-schedules/', data);
            }
            onClose();
        } catch (error) {
            console.error('Error submitting activity:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{activity ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Batch</InputLabel>
                            <Select
                                name="batchID"
                                value={formData.batchID}
                                onChange={handleChange}
                            >
                                {batches.map((batch) => (
                                    <MenuItem key={batch.batchID} value={batch.batchID}>
                                        {batch.farm_name} - {batch.breed_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Activity Name"
                            name="activityName"
                            value={formData.activityName}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Description"
                            name="activityDescription"
                            value={formData.activityDescription}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                        />
                        <TextField
                            label="Day"
                            name="activityDay"
                            value={formData.activityDay}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel>Frequency</InputLabel>
                            <Select
                                name="activity_frequency"
                                value={formData.activity_frequency}
                                onChange={handleChange}
                            >
                                {[1, 2, 3, 4, 5, 6, 7].map((freq) => (
                                    <MenuItem key={freq} value={freq}>
                                        Every {freq} days
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="activity_status"
                                value={formData.activity_status ? 1 : 0}
                                onChange={handleChange}
                            >
                                <MenuItem value={1}>Active</MenuItem>
                                <MenuItem value={0}>Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {activity ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ActivityForm;
