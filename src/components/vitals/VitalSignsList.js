import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const VitalSignsList = ({ onEdit }) => {
    const [vitals, setVitals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVitals();
    }, []);

    const fetchVitals = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/vital-signs/');
            setVitals(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching vital signs:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/vital-signs/${id}/`);
            fetchVitals();
        } catch (error) {
            console.error('Error deleting vital sign:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Batch</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Temperature</TableCell>
                        <TableCell>Weight</TableCell>
                        <TableCell>Mortality</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {vitals.map((vital) => (
                        <TableRow key={vital.vitalID}>
                            <TableCell>
                                {vital.batch?.farm?.name || 'N/A'} -
                                {vital.batch?.breed?.name || 'N/A'}
                            </TableCell>
                            <TableCell>{new Date(vital.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                                {vital.temperature}°C
                            </TableCell>
                            <TableCell>
                                {vital.weight}g
                            </TableCell>
                            <TableCell>
                                {vital.mortality}%
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => onEdit(vital)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(vital.vitalID)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default VitalSignsList;
