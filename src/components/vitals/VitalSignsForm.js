import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tab,
    Tabs,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    DatePicker,
    LocalizationProvider,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';

const VitalSignsForm = ({ open, onClose, vital = null }) => {
    const [formData, setFormData] = useState({
        batchID: '',
        date: null,
        temperature: '',
        weight: '',
        mortality: '',
        notes: '',
    });
    const [batches, setBatches] = useState([]);

    useEffect(() => {
        fetchBatches();
    }, []);

    useEffect(() => {
        if (vital) {
            setFormData({
                batchID: vital.batchID,
                date: new Date(vital.date),
                temperature: vital.temperature,
                weight: vital.weight,
                mortality: vital.mortality,
                notes: vital.notes,
            });
        }
    }, [vital]);

    const fetchBatches = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/batches/');
            setBatches(response.data);
        } catch (error) {
            console.error('Error fetching batches:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            date: date,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                date: formData.date.toISOString().split('T')[0],
            };

            if (vital) {
                await axios.put(`http://localhost:8000/api/vital-signs/${vital.vitalID}/`, data);
            } else {
                await axios.post('http://localhost:8000/api/vital-signs/', data);
            }
            onClose();
        } catch (error) {
            console.error('Error submitting vital sign:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{vital ? 'Edit Vital Signs' : 'Add New Vital Signs'}</DialogTitle>
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
                                label="Date"
                                value={formData.date}
                                onChange={handleDateChange}
                                renderInput={(params) => <TextField {...params} fullWidth required />}
                            />
                        </LocalizationProvider>
                        <TextField
                            label="Temperature (°C)"
                            name="temperature"
                            value={formData.temperature}
                            onChange={handleChange}
                            type="number"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Weight (g)"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            type="number"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Mortality (%)"
                            name="mortality"
                            value={formData.mortality}
                            onChange={handleChange}
                            type="number"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {vital ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default VitalSignsForm;
