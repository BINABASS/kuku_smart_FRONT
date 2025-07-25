import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import axios from 'axios';

const BatchForm = ({ open, onClose, batch = null, onSave, useSample }) => {
    const [farms, setFarms] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [formData, setFormData] = useState({
        farmID: '',
        breedID: '',
        arriveDate: '',
        initAge: '',
        harvestAge: '',
        quantity: '',
        initWeight: '',
    });

    useEffect(() => {
        fetchFarms();
        fetchBreeds();
    }, []);

    useEffect(() => {
        if (batch) {
            setFormData({
                farmID: batch.farmID,
                breedID: batch.breedID,
                arriveDate: batch.arrive_date,
                initAge: batch.init_age,
                harvestAge: batch.harvest_age,
                quantity: batch.quantity,
                initWeight: batch.init_weight,
            });
        }
    }, [batch]);

    const fetchFarms = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/farms/');
            setFarms(response.data);
        } catch (error) {
            console.error('Error fetching farms:', error);
        }
    };

    const fetchBreeds = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/breeds/');
            setBreeds(response.data);
        } catch (error) {
            console.error('Error fetching breeds:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (useSample) {
            onSave({
                ...formData,
                farm_name: farms.find(f => f.farmID === formData.farmID)?.name || '',
                breed_name: breeds.find(b => b.breedID === formData.breedID)?.name || '',
            });
            onClose();
            return;
        }
        try {
            if (batch) {
                await axios.put(`http://localhost:8000/api/batches/${batch.batchID}/`, formData);
            } else {
                await axios.post('http://localhost:8000/api/batches/', formData);
            }
            onClose();
        } catch (error) {
            console.error('Error submitting batch:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{batch ? 'Edit Batch' : 'Add New Batch'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Farm</InputLabel>
                            <Select
                                name="farmID"
                                value={formData.farmID}
                                onChange={handleChange}
                            >
                                {farms.map((farm) => (
                                    <MenuItem key={farm.farmID} value={farm.farmID}>
                                        {farm.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Breed</InputLabel>
                            <Select
                                name="breedID"
                                value={formData.breedID}
                                onChange={handleChange}
                            >
                                {breeds.map((breed) => (
                                    <MenuItem key={breed.breedID} value={breed.breedID}>
                                        {breed.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Arrival Date"
                            type="date"
                            name="arriveDate"
                            value={formData.arriveDate}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Initial Age"
                            type="number"
                            name="initAge"
                            value={formData.initAge}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Quantity"
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Initial Weight"
                            type="number"
                            name="initWeight"
                            value={formData.initWeight}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {batch ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default BatchForm;
