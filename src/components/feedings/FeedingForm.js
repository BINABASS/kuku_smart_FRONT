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
    MenuItem
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';

const FeedingForm = ({ open, onClose, feeding = null, onSave, useSample }) => {
    const [formData, setFormData] = useState({
        batchID: '',
        feeding_date: null,
        feeding_amount: '',
        status: true,
    });
    const [batches, setBatches] = useState([]);

    useEffect(() => {
        fetchBatches();
    }, []);

    useEffect(() => {
        if (feeding) {
            setFormData({
                batchID: feeding.batchID,
                feeding_date: new Date(feeding.feeding_date),
                feeding_amount: feeding.feeding_amount,
                status: feeding.status === 1,
            });
        }
    }, [feeding]);

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

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            feeding_date: date,
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
                feeding_date: formData.feeding_date.toISOString().split('T')[0],
                status: formData.status ? 1 : 0,
            };

            if (feeding) {
                await axios.put(`http://localhost:8000/api/batch-feedings/${feeding.batchFeedingID}/`, data);
            } else {
                await axios.post('http://localhost:8000/api/batch-feedings/', data);
            }
            onClose();
        } catch (error) {
            console.error('Error submitting feeding:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{feeding ? 'Edit Feeding' : 'Add New Feeding'}</DialogTitle>
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
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <MuiDatePicker
                                label="Feeding Date"
                                value={formData.feeding_date}
                                onChange={handleDateChange}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                        <TextField
                            label="Feeding Amount"
                            name="feeding_amount"
                            value={formData.feeding_amount}
                            onChange={handleChange}
                            type="number"
                            fullWidth
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status ? 1 : 0}
                                onChange={handleChange}
                            >
                                <MenuItem value={1}>Completed</MenuItem>
                                <MenuItem value={0}>Pending</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {feeding ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default FeedingForm;
