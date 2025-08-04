import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Alert,
    CircularProgress,
    Box,
    Typography
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../../api/client';

const FarmerList = ({ onEdit, onSuccess }) => {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/farmers/');
            setFarmers(response.data);
        } catch (error) {
            console.error('Error fetching farmers:', error);
            setError('Failed to fetch farmers data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/farmers/${id}/`);
            fetchFarmers();
            onSuccess && onSuccess();
        } catch (error) {
            console.error('Error deleting farmer:', error);
            setError('Failed to delete farmer');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Farmers ({farmers.length})
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Farm</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {farmers.map((farmer) => (
                            <TableRow key={farmer.id}>
                                <TableCell>{`${farmer.first_name} ${farmer.last_name}`}</TableCell>
                                <TableCell>{farmer.user?.email || 'N/A'}</TableCell>
                                <TableCell>{farmer.phone}</TableCell>
                                <TableCell>{farmer.farm?.name || 'N/A'}</TableCell>
                                <TableCell>
                                    {farmer.status ? 'Active' : 'Inactive'}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => onEdit(farmer)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(farmer.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default FarmerList;
