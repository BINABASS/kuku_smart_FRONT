import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tabs,
    Tab,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Button,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../../config/api';

const BreedForm = ({ open, onClose, breed = null, onSave, useSample }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        activities: [],
        conditions: [],
        feedings: [],
    });
    const [tab, setTab] = useState(0);
    const [activityTypes, setActivityTypes] = useState([]);

    useEffect(() => {
        fetchActivityTypes();
    }, []);

    useEffect(() => {
        if (breed) {
            setFormData({
                name: breed.name,
                description: breed.description,
                activities: breed.activities || [],
                conditions: breed.conditions || [],
                feedings: breed.feedings || [],
            });
        }
    }, [breed]);

    const fetchActivityTypes = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/condition-types/`);
            setActivityTypes(response.data);
        } catch (error) {
            console.error('Error fetching activity types:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAddActivity = () => {
        setFormData({
            ...formData,
            activities: [...formData.activities, { age: '', activityTypeID: '' }],
        });
    };

    const handleAddCondition = () => {
        setFormData({
            ...formData,
            conditions: [...formData.conditions, { type: '', min: '', max: '' }],
        });
    };
    const handleAddFeeding = () => {
        setFormData({
            ...formData,
            feedings: [...formData.feedings, { feedType: '', quantity: '', frequency: '', age: '' }],
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
            if (breed) {
                await axios.put(`http://localhost:8000/api/breeds/${breed.breedID}/`, formData);
            } else {
                await axios.post('http://localhost:8000/api/breeds/', formData);
            }
            onClose();
        } catch (error) {
            console.error('Error submitting breed:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{breed ? 'Edit Breed' : 'Add New Breed'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
                            <Tab label="Basic Info" />
                            <Tab label="Activities" />
                            <Tab label="Conditions" />
                            <Tab label="Feedings" />
                        </Tabs>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        {tab === 0 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    rows={4}
                                />
                            </Box>
                        )}
                        {tab === 1 && (
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddActivity}
                                    >
                                        Add Activity
                                    </Button>
                                </Box>
                                <TableContainer>
                                    <Table>
                                        <TableBody>
                                            {formData.activities.map((activity, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <TextField
                                                            label="Age"
                                                            type="number"
                                                            value={activity.age}
                                                            onChange={(e) => {
                                                                const newActivities = [...formData.activities];
                                                                newActivities[index].age = e.target.value;
                                                                setFormData({ ...formData, activities: newActivities });
                                                            }}
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FormControl fullWidth>
                                                            <InputLabel>Activity Type</InputLabel>
                                                            <Select
                                                                value={activity.activityTypeID}
                                                                onChange={(e) => {
                                                                    const newActivities = [...formData.activities];
                                                                    newActivities[index].activityTypeID = e.target.value;
                                                                    setFormData({ ...formData, activities: newActivities });
                                                                }}
                                                            >
                                                                {activityTypes.map((type) => (
                                                                    <MenuItem key={type.activityTypeID} value={type.activityTypeID}>
                                                                        {type.activity_type}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            onClick={() => {
                                                                const newActivities = [...formData.activities];
                                                                newActivities.splice(index, 1);
                                                                setFormData({ ...formData, activities: newActivities });
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                        {tab === 2 && (
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddCondition}
                                    >
                                        Add Condition
                                    </Button>
                                </Box>
                                <TableContainer>
                                    <Table>
                                        <TableBody>
                                            {formData.conditions.map((condition, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <TextField
                                                            label="Condition Type"
                                                            value={condition.type}
                                                            onChange={(e) => {
                                                                const newConditions = [...formData.conditions];
                                                                newConditions[index].type = e.target.value;
                                                                setFormData({ ...formData, conditions: newConditions });
                                                            }}
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            label="Min Value"
                                                            type="number"
                                                            value={condition.min}
                                                            onChange={(e) => {
                                                                const newConditions = [...formData.conditions];
                                                                newConditions[index].min = e.target.value;
                                                                setFormData({ ...formData, conditions: newConditions });
                                                            }}
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            label="Max Value"
                                                            type="number"
                                                            value={condition.max}
                                                            onChange={(e) => {
                                                                const newConditions = [...formData.conditions];
                                                                newConditions[index].max = e.target.value;
                                                                setFormData({ ...formData, conditions: newConditions });
                                                            }}
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            onClick={() => {
                                                                const newConditions = [...formData.conditions];
                                                                newConditions.splice(index, 1);
                                                                setFormData({ ...formData, conditions: newConditions });
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                        {tab === 3 && (
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddFeeding}
                                    >
                                        Add Feeding
                                    </Button>
                                </Box>
                                <TableContainer>
                                    <Table>
                                        <TableBody>
                                            {formData.feedings.map((feeding, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <TextField
                                                            label="Feed Type"
                                                            value={feeding.feedType}
                                                            onChange={(e) => {
                                                                const newFeedings = [...formData.feedings];
                                                                newFeedings[index].feedType = e.target.value;
                                                                setFormData({ ...formData, feedings: newFeedings });
                                                            }}
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            label="Quantity (g)"
                                                            type="number"
                                                            value={feeding.quantity}
                                                            onChange={(e) => {
                                                                const newFeedings = [...formData.feedings];
                                                                newFeedings[index].quantity = e.target.value;
                                                                setFormData({ ...formData, feedings: newFeedings });
                                                            }}
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            label="Frequency (per day)"
                                                            type="number"
                                                            value={feeding.frequency}
                                                            onChange={(e) => {
                                                                const newFeedings = [...formData.feedings];
                                                                newFeedings[index].frequency = e.target.value;
                                                                setFormData({ ...formData, feedings: newFeedings });
                                                            }}
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            label="Age"
                                                            type="number"
                                                            value={feeding.age}
                                                            onChange={(e) => {
                                                                const newFeedings = [...formData.feedings];
                                                                newFeedings[index].age = e.target.value;
                                                                setFormData({ ...formData, feedings: newFeedings });
                                                            }}
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            onClick={() => {
                                                                const newFeedings = [...formData.feedings];
                                                                newFeedings.splice(index, 1);
                                                                setFormData({ ...formData, feedings: newFeedings });
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {breed ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default BreedForm;
