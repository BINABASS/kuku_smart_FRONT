import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const FarmerList = ({ onEdit }) => {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/farmers/');
            setFarmers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching farmers:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/farmers/${id}/`);
            fetchFarmers();
        } catch (error) {
            console.error('Error deleting farmer:', error);
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
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Farm</TableCell>
                        <TableCell>Batches</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {farmers.map((farmer) => (
                        <TableRow key={farmer.farmerID}>
                            <TableCell>{`${farmer.first_name} ${farmer.last_name}`}</TableCell>
                            <TableCell>{farmer.user.email}</TableCell>
                            <TableCell>{farmer.phone}</TableCell>
                            <TableCell>{farmer.farm?.name || 'N/A'}</TableCell>
                            <TableCell>
                                {farmer.farm?.batches?.length || 0}
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => onEdit(farmer)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(farmer.farmerID)}>
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

export default FarmerList;
